import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import {
    getAnthropicApiKey,
    getAnthropicBaseUrl,
    getCustomModels,
    getDefaultModel,
    getOpenAIApiKey,
    getOpenAIBaseUrl,
} from "./config";
import { SUPPORTED_CHAT_MODELS } from "../../../shared/src/models";

export const COMMON_LOCAL_MODELS = [
    // OpenAI / OpenAI-compatible
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-5.4-nano",
    "deepseek-chat",
    "deepseek-reasoner",
    "qwen2.5-coder:32b",
    "llama3.2",
    // Anthropic
    "claude-3-7-sonnet-latest",
    "claude-3-5-sonnet-latest",
    "claude-3-5-haiku-latest",
];

export function getAvailableModels(): string[] {
    const custom = getCustomModels();
    const defaults = SUPPORTED_CHAT_MODELS.map((m) => m.id);
    const combined = [
        ...custom,
        ...COMMON_LOCAL_MODELS,
        ...defaults,
    ];
    return Array.from(new Set(combined));
}

export function resolveLocalModel(modelId?: string): {
    model: LanguageModel;
    modelId: string;
    provider: "anthropic" | "openai";
} {
    const selectedModelId = modelId || getDefaultModel() || "gpt-4o";

    const isAnthropic =
        selectedModelId.startsWith("claude-") ||
        selectedModelId.startsWith("anthropic/");

    const cleanModelId = selectedModelId.replace(/^(anthropic|openai)\//, "");

    if (isAnthropic) {
        const apiKey = getAnthropicApiKey();
        const baseURL = getAnthropicBaseUrl();

        if (!apiKey) {
            throw new Error(
                `ANTHROPIC_API_KEY is not set. Please set ANTHROPIC_API_KEY in your environment or run with an OpenAI / Ollama model.`
            );
        }

        const anthropic = createAnthropic({
            apiKey,
            baseURL,
        });

        return {
            model: anthropic(cleanModelId),
            modelId: selectedModelId,
            provider: "anthropic",
        };
    }

    // Default to OpenAI / OpenAI-compatible (Ollama, DeepSeek, OpenRouter, Groq, etc.)
    const apiKey = getOpenAIApiKey() || (getOpenAIBaseUrl() ? "ollama" : undefined);
    const baseURL = getOpenAIBaseUrl();

    if (!apiKey && !baseURL) {
        throw new Error(
            `No API key configured. Please set OPENAI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_BASE_URL (for Ollama) in your environment.`
        );
    }

    const openai = createOpenAI({
        apiKey: apiKey || "dummy-key",
        baseURL,
    });

    return {
        model: openai(cleanModelId),
        modelId: selectedModelId,
        provider: "openai",
    };
}
