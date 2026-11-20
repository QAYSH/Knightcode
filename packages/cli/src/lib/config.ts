import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export type NightcodeConfig = {
    standalone?: boolean;
    defaultModel?: string;
    openaiApiKey?: string;
    openaiBaseUrl?: string;
    anthropicApiKey?: string;
    anthropicBaseUrl?: string;
    customModels?: string[];
};

const CONFIG_DIR = join(homedir(), ".nightcode");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function loadUserConfig(): NightcodeConfig {
    try {
        if (existsSync(CONFIG_FILE)) {
            const raw = readFileSync(CONFIG_FILE, "utf-8");
            return JSON.parse(raw);
        }
    } catch {
        // ignore parse errors
    }
    return {};
}

export function saveUserConfig(config: Partial<NightcodeConfig>) {
    try {
        if (!existsSync(CONFIG_DIR)) {
            mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
        }
        const existing = loadUserConfig();
        writeFileSync(CONFIG_FILE, JSON.stringify({ ...existing, ...config }, null, 2), { mode: 0o600 });
    } catch {
        // ignore
    }
}

export function isStandaloneMode(): boolean {
    if (process.env.STANDALONE === "true" || process.env.STANDALONE === "1") {
        return true;
    }
    if (process.env.STANDALONE === "false" || process.env.STANDALONE === "0") {
        return false;
    }
    if (process.env.API_URL === "local") {
        return true;
    }

    const userConfig = loadUserConfig();
    if (userConfig.standalone === true) {
        return true;
    }

    const hasLocalKeys = Boolean(
        process.env.OPENAI_API_KEY ||
        process.env.ANTHROPIC_API_KEY ||
        process.env.OPENAI_BASE_URL ||
        userConfig.openaiApiKey ||
        userConfig.anthropicApiKey ||
        userConfig.openaiBaseUrl
    );

    // If API_URL is unset, or if API_URL is localhost:3000 but user has provided local keys, default to standalone
    if (!process.env.API_URL) {
        return true;
    }

    if (hasLocalKeys && process.env.API_URL.includes("localhost:3000")) {
        return true;
    }

    return hasLocalKeys;
}

export function getOpenAIApiKey(): string | undefined {
    return process.env.OPENAI_API_KEY || loadUserConfig().openaiApiKey;
}

export function getOpenAIBaseUrl(): string | undefined {
    return process.env.OPENAI_BASE_URL || loadUserConfig().openaiBaseUrl;
}

export function getAnthropicApiKey(): string | undefined {
    return process.env.ANTHROPIC_API_KEY || loadUserConfig().anthropicApiKey;
}

export function getAnthropicBaseUrl(): string | undefined {
    return process.env.ANTHROPIC_BASE_URL || loadUserConfig().anthropicBaseUrl;
}

export function getDefaultModel(): string | undefined {
    return process.env.DEFAULT_MODEL || loadUserConfig().defaultModel;
}

export function getCustomModels(): string[] {
    const fromEnv = process.env.CUSTOM_MODELS
        ? process.env.CUSTOM_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
        : [];
    const fromConfig = loadUserConfig().customModels ?? [];
    return Array.from(new Set([...fromEnv, ...fromConfig]));
}
