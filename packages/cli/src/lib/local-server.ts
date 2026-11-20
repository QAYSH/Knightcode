import { Hono } from "hono";
import {
    convertToModelMessages,
    streamText,
    validateUIMessages,
    type InferUITools,
    type LanguageModelUsage,
    type UIMessage,
} from "ai";
import {
    getToolContracts,
    type ModeType,
    type ToolContracts,
} from "../../../shared/src/schemas";
import { buildSystemPrompt } from "../../../shared/src/system-prompt";
import {
    createLocalSession,
    getLocalSession,
    listLocalSessions,
    updateLocalSessionMessages,
} from "./local-db";
import { resolveLocalModel } from "./local-models";

type ChatMessageMetadata = {
    mode?: ModeType;
    model?: string;
    durationMs?: number;
    usage?: LanguageModelUsage;
};

type NightcodeUIMessage = UIMessage<
    ChatMessageMetadata,
    never,
    InferUITools<ToolContracts>
>;

function hasPendingToolCalls(message: NightcodeUIMessage): boolean {
    return message.parts.some((part) => {
        if (part.type === "dynamic-tool" || part.type.startsWith("tool-")) {
            const state = (part as { state?: string }).state;
            return state !== "output-available" && state !== "output-error";
        }
        return false;
    });
}

export function createLocalApp() {
    const app = new Hono();

    // Sessions routes
    app.get("/sessions", (c) => {
        const sessions = listLocalSessions();
        return c.json(sessions);
    });

    app.get("/sessions/:id", (c) => {
        const id = c.req.param("id");
        const session = getLocalSession(id);
        if (!session) {
            return c.json({ error: "Session not found" }, 404);
        }
        return c.json(session);
    });

    app.post("/sessions", async (c) => {
        const body = (await c.req.json().catch(() => ({}))) as { title?: string };
        const title = body.title || "New Session";
        const session = createLocalSession(title);
        return c.json(session, 201);
    });

    // Chat route
    app.post("/chat", async (c) => {
        const body = (await c.req.json()) as {
            id: string;
            messages: NightcodeUIMessage[];
            mode: ModeType;
            model: string;
        };

        const { id, messages, mode, model } = body;
        const session = getLocalSession(id);

        if (!session) {
            return c.json({ error: "Session not found" }, 404);
        }

        const startTime = Date.now();
        const tools = getToolContracts(mode);
        const resolvedModel = resolveLocalModel(model);

        const previousMessages = Array.isArray(session.messages)
            ? (session.messages as unknown as NightcodeUIMessage[])
            : [];
        const mergedMessages = [...previousMessages];

        for (const message of messages) {
            const incomingMessage = {
                ...message,
                metadata: { ...message.metadata, mode, model },
            } satisfies NightcodeUIMessage;

            const existingMessageIndex = mergedMessages.findIndex(
                (m) => m.id === incomingMessage.id
            );

            if (existingMessageIndex === -1) {
                mergedMessages.push(incomingMessage);
            } else {
                mergedMessages[existingMessageIndex] = incomingMessage;
            }
        }

        const nextMessages = await validateUIMessages<NightcodeUIMessage>({
            messages: mergedMessages,
            tools,
        });

        const modelMessages = await convertToModelMessages(nextMessages, { tools });
        let completedUsage: LanguageModelUsage | null = null;

        const result = streamText({
            model: resolvedModel.model,
            system: buildSystemPrompt({ mode }),
            messages: modelMessages,
            tools,
            onFinish(event) {
                completedUsage = event.usage;
            },
        });

        return result.toUIMessageStreamResponse<NightcodeUIMessage>({
            originalMessages: nextMessages,
            messageMetadata({ part }) {
                if (part.type === "start") {
                    return { mode, model };
                }

                if (part.type !== "finish") return undefined;

                return {
                    mode,
                    model,
                    durationMs: Date.now() - startTime,
                    ...(completedUsage ? { usage: completedUsage } : {}),
                };
            },
            async onFinish(event) {
                if (event.isAborted) return;
                if (hasPendingToolCalls(event.responseMessage)) return;

                updateLocalSessionMessages(
                    id,
                    event.messages as unknown as NightcodeUIMessage[]
                );
            },
            onError(error) {
                return error instanceof Error ? error.message : String(error);
            },
        });
    });

    // Billing stubs (no-op in standalone mode)
    app.post("/billing/checkout", (c) => {
        return c.json({ url: "" });
    });

    app.post("/billing/portal", (c) => {
        return c.json({ url: "" });
    });

    return app;
}

export const localApp = createLocalApp();
