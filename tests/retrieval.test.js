import test from "node:test";
import assert from "node:assert/strict";
import { rankKnowledgeChunks, tokenize } from "../src/lib/ai/retrieval.js";

test("tokenize removes punctuation and stopwords", () => {
    const tokens = tokenize("What is async communication in microservices?");
    assert.ok(tokens.includes("async"));
    assert.ok(tokens.includes("communication"));
    assert.ok(!tokens.includes("is"));
});

test("rankKnowledgeChunks returns relevant chunks first", () => {
    const chunks = [
        {
            id: "1",
            title: "Sync HTTP",
            tags: ["sync", "http"],
            content: "request response over http and grpc",
        },
        {
            id: "2",
            title: "Event Driven",
            tags: ["event", "broker"],
            content: "asynchronous event broker with consumers",
        },
    ];

    const ranked = rankKnowledgeChunks("event broker async", chunks, 2);
    assert.equal(ranked.length, 1);
    assert.equal(ranked[0].id, "2");
});
