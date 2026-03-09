import type { APIRoute } from "astro";
import { loadKnowledgeChunks } from "../../lib/ai/knowledge.js";
import { rankKnowledgeChunks } from "../../lib/ai/retrieval.js";
import { generateStrictAnswer } from "../../lib/ai/chat-service.js";
import { GemmaApiError } from "../../lib/ai/gemma-client.js";

function createJsonResponse(status: number, payload: unknown) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

function mapGemmaError(err: GemmaApiError) {
    if (err.status === 400) {
        return {
            status: 502,
            code: "UPSTREAM_BAD_REQUEST",
            message: `Gemma rejected the request payload: ${err.message}`,
            upstreamStatus: 400,
            upstreamCode: err.details,
        };
    }

    if (err.status === 404) {
        return {
            status: 502,
            code: "UPSTREAM_MODEL_NOT_FOUND",
            message:
                "Gemma model endpoint was not found. Verify GEMMA_ENDPOINT and model availability for your API key.",
            upstreamStatus: 404,
            upstreamCode: err.details,
        };
    }

    if (err.status === 401 || err.status === 403) {
        return {
            status: 502,
            code: "UPSTREAM_AUTH_ERROR",
            message: "Gemma authentication failed. Please verify GEMINI_API_KEY.",
            upstreamStatus: err.status,
            upstreamCode: err.details,
        };
    }

    if (err.status === 429) {
        return {
            status: 429,
            code: "UPSTREAM_RATE_LIMIT",
            message: "Gemma rate limit reached. Please retry shortly.",
            upstreamStatus: 429,
            upstreamCode: err.details,
        };
    }

    if (err.status === 500 && err.message.includes("Missing GEMINI_API_KEY")) {
        return {
            status: 500,
            code: "MISSING_API_KEY",
            message: err.message,
        };
    }

    if (err.status >= 500) {
        return {
            status: 502,
            code: "UPSTREAM_SERVER_ERROR",
            message: `Gemma upstream service is temporarily unavailable: ${err.message}`,
            upstreamStatus: err.status,
            upstreamCode: err.details,
        };
    }

    return {
        status: 500,
        code: "CHAT_ERROR",
        message: err.message || "Failed to generate chat response.",
        upstreamStatus: err.status,
        upstreamCode: err.details,
    };
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const messages = Array.isArray(body?.messages) ? body.messages : [];
        const maxContextChunks = Number(body?.maxContextChunks || 8);

        if (!messages.length) {
            return createJsonResponse(400, {
                error: {
                    code: "INVALID_REQUEST",
                    message: "messages is required and must be a non-empty array.",
                },
            });
        }

        const lastUserMessage = [...messages]
            .reverse()
            .find((entry) => entry?.role === "user" && typeof entry?.content === "string");

        if (!lastUserMessage?.content?.trim()) {
            return createJsonResponse(400, {
                error: {
                    code: "INVALID_REQUEST",
                    message: "At least one user message with text content is required.",
                },
            });
        }

        const knowledgeChunks = await loadKnowledgeChunks();
        const selectedChunks = rankKnowledgeChunks(
            lastUserMessage.content,
            knowledgeChunks,
            Number.isNaN(maxContextChunks) ? 8 : Math.min(Math.max(maxContextChunks, 1), 12),
        );

        const answer = await generateStrictAnswer({
            messages: messages
                .filter(
                    (entry) =>
                        (entry?.role === "user" || entry?.role === "assistant") &&
                        typeof entry?.content === "string",
                )
                .map((entry) => ({ role: entry.role, content: entry.content.trim() })),
            chunks: selectedChunks,
        });

        return createJsonResponse(200, {
            answer,
            citations: [],
            usedChunkIds: selectedChunks.map((chunk) => chunk.id),
        });
    } catch (err) {
        if (err instanceof GemmaApiError) {
            const mapped = mapGemmaError(err);
            return createJsonResponse(mapped.status, {
                error: {
                    code: mapped.code,
                    message: mapped.message,
                    upstreamStatus: mapped.upstreamStatus,
                    upstreamCode: mapped.upstreamCode,
                },
            });
        }

        return createJsonResponse(500, {
            error: {
                code: "CHAT_ERROR",
                message: "Unexpected error while processing /api/chat.",
            },
        });
    }
};
