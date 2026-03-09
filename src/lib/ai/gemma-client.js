const DEFAULT_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent";

export class GemmaApiError extends Error {
    constructor(message, status, details = "") {
        super(message);
        this.name = "GemmaApiError";
        this.status = status;
        this.details = details;
    }
}

export function buildGemmaPayload(prompt) {
    return {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 700,
        },
    };
}

export function extractGemmaText(responseJson) {
    const text = (responseJson?.candidates || [])
        .flatMap((candidate) => candidate?.content?.parts || [])
        .map((part) => part?.text || "")
        .join("")
        .trim();

    return text;
}

export async function generateGemmaContent(prompt, options = {}) {
    const astroEnv =
        typeof import.meta !== "undefined" && import.meta ? import.meta.env : undefined;
    const endpoint =
        options.endpoint ||
        astroEnv?.GEMMA_ENDPOINT ||
        process.env.GEMMA_ENDPOINT ||
        DEFAULT_ENDPOINT;
    const apiKey =
        options.apiKey || astroEnv?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const fetchImpl = options.fetchImpl || fetch;

    if (!apiKey) {
        throw new GemmaApiError(
            "Missing GEMINI_API_KEY. Configure it before using /api/chat.",
            500,
        );
    }

    const url = new URL(endpoint);
    url.searchParams.set("key", apiKey);

    const response = await fetchImpl(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildGemmaPayload(prompt)),
    });

    const responseJson = await response.json().catch(() => ({}));
    if (!response.ok) {
        const providerMessage =
            responseJson?.error?.message || "Gemma API request failed";
        const providerStatus = responseJson?.error?.status || "";
        throw new GemmaApiError(providerMessage, response.status, providerStatus);
    }

    const answer = extractGemmaText(responseJson);
    if (!answer) {
        throw new GemmaApiError(
            "Gemma returned an empty response. Try rephrasing the question.",
            502,
        );
    }

    return answer;
}
