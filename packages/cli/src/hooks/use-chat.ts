import { useMemo } from "react";
import { useChat as useAiChat } from "@ai-sdk/react";
import {
    DefaultChatTransport,
    type InferUITools,
    lastAssistantMessageIsCompleteWithToolCalls,
    type LanguageModelUsage,
    type UIMessage,
} from "ai";
import { type ModeType, type ToolContracts } from "../../../shared/src/schemas"
import { apiClient } from "../lib/api-client";
import { executeLocalTool } from "../lib/local-tool";
import { type SupportedChatModelId } from "../../../shared/src/models";
import { getAuth } from "../lib/auth";
import { isStandaloneMode } from "../lib/config";
import { localApp } from "../lib/local-server";

export type ChatMessageMetadata = {
    mode?: ModeType;
    model?: SupportedChatModelId | string;
    durationMs?: number;
    usage?: LanguageModelUsage;
};

type ChatTools = {
    [Name in keyof InferUITools<ToolContracts>]: {
        input: InferUITools<ToolContracts>[Name]["input"];
        output: unknown;
    };
};

export type Message = UIMessage<ChatMessageMetadata, never, ChatTools>;

export function useChat(sessionId: string, initialMessages: Message[]) {
    const transport = useMemo(() => {
        const isStandalone = isStandaloneMode();

        return new DefaultChatTransport<Message>({
            api: apiClient.chat.$url().toString(),
            fetch: isStandalone
                ? (input, init) => localApp.fetch(new Request(input, init))
                : undefined,
            headers() {
                if (isStandalone) return new Headers();
                const auth = getAuth();
                return auth ? { Authorization: `Bearer ${auth.token}` } : new Headers();
            },
            prepareSendMessagesRequest({ messages }) {
                const message = messages[messages.length - 1];
                if (!message) throw new Error("No message to send");

                const metadata = messages.findLast(
                    (m) => m.metadata?.mode && m.metadata?.model,
                )?.metadata;
                const previousMessage = messages[messages.length - 2];
                const requestMessages = message.role === "assistant" && previousMessage?.role === "user"
                ? [previousMessage, message]
                : [message];
            
                return {
                    body: {
                        id: sessionId,
                        messages: requestMessages,
                        mode: message.metadata?.mode ?? metadata?.mode ?? "BUILD",
                        model: message.metadata?.model ?? metadata?.model ?? "gpt-4o",
                    },
                };
            }
        });
    }, [sessionId]);

    const chat = useAiChat<Message>({
        id: sessionId,
        messages: initialMessages,
        transport,
        onToolCall({ toolCall }) {
            const mode = chat.messages.at(-1)?.metadata?.mode ?? "BUILD";

            void executeLocalTool(toolCall.toolName, toolCall.input, mode)
                .then((output) => 
                    chat.addToolOutput({
                        tool: toolCall.toolName as keyof ChatTools,
                        toolCallId: toolCall.toolCallId,
                        output,
                    }),
                )
                .catch((error) => 
                   chat.addToolOutput({
                    tool: toolCall.toolName as keyof ChatTools,
                    toolCallId: toolCall.toolCallId,
                    state: "output-error",
                    errorText: error instanceof Error ? error.message : String(error),
                   }),
                );
        },
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    });

    return {
        messages: chat.messages,
        status: chat.status,
        error: chat.error,
        submit: (params: { userText: string; mode: ModeType; model: SupportedChatModelId | string }) =>{
            chat.sendMessage({
                text: params.userText,
                metadata: {
                    mode: params.mode,
                    model: params.model,
                },
            })
        },
        abort: chat.stop,
        interrupt: chat.stop,
    };
};