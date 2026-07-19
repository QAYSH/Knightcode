export type ModelPricing = {
    inputUsdPerMillionTokens: number;
    outputUsdPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai"

type SupportedChatModelDefinition ={
    id: string;
    provider: SupportedProvider;
    pricing: ModelPricing;
};

export const SUPPORTED_CHAT_MODELS = [
    {
        id: "claude-sonnet-4-6",
        provider: "anthropic",
        pricing: {
            inputUsdPerMillionTokens: 1,
            outputUsdPerMillionTokens: 15,
        },
    },
    {
        id: "claude-haiku-4-5",
        provider: "anthropic",
        pricing: {
                inputUsdPerMillionTokens: 1,
                outputUsdPerMillionTokens: 5,
            },
    },
    {
        id: "claude-opus-4-6",
        provider: "anthropic",
        pricing: {
            inputUsdPerMillionTokens: 5,
            outputUsdPerMillionTokens: 25,
        },
    },
