import { hc } from "hono/client";
import type { AppType } from "../../../server/src/index";
import { clearAuth, getAuth } from "./auth";
import { isStandaloneMode } from "./config";
import { localApp } from "./local-server";

const isStandalone = isStandaloneMode();

const customFetch = async (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
) => {
    if (isStandalone) {
        return localApp.fetch(new Request(input, init));
    }

    const headers = new Headers(init?.headers);
    const auth = getAuth();

    if (auth) {
        headers.set("Authorization", `Bearer ${auth.token}`);
    }

    const response = await fetch(input, { ...init, headers });
    if (response.status === 401) {
        clearAuth();
    }

    return response;
};

const baseUrl = isStandalone
    ? "http://local"
    : (process.env.API_URL ?? "https://nightcodeserver-production-946f.up.railway.app");

export const apiClient = hc<AppType>(baseUrl, {
    fetch: customFetch,
});
