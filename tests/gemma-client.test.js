import test from "node:test";
import assert from "node:assert/strict";
import { buildGemmaPayload, extractGemmaText, generateGemmaContent } from "../src/lib/ai/gemma-client.js";

test("buildGemmaPayload creates prompt payload", () => {
    const payload = buildGemmaPayload("hello");
    assert.equal(payload.contents[0].role, "user");
    assert.equal(payload.contents[0].parts[0].text, "hello");
    assert.equal(typeof payload.generationConfig.maxOutputTokens, "number");
});

test("extractGemmaText parses text from candidates", () => {
    const parsed = extractGemmaText({
        candidates: [
            {
                content: {
                    parts: [{ text: "Part 1 " }, { text: "Part 2" }],
                },
            },
        ],
    });
    assert.equal(parsed, "Part 1 Part 2");
});

test("generateGemmaContent throws missing key error", async () => {
    await assert.rejects(
        () =>
            generateGemmaContent("hello", {
                apiKey: "",
                fetchImpl: async () => ({ ok: true, json: async () => ({}) }),
            }),
        /Missing GEMINI_API_KEY/,
    );
});

test("generateGemmaContent maps upstream 429", async () => {
    await assert.rejects(
        () =>
            generateGemmaContent("hello", {
                apiKey: "dummy",
                fetchImpl: async () => ({
                    ok: false,
                    status: 429,
                    json: async () => ({ error: { message: "Too many requests" } }),
                }),
            }),
        /Too many requests/,
    );
});
