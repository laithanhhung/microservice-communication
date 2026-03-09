const STOPWORDS = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "how",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "to",
    "with",
    "v",
    "va",
    "và",
    "la",
    "là",
    "cho",
    "cua",
    "của",
    "khi",
    "nen",
    "nên",
    "gi",
    "gì",
]);

export function tokenize(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function countMatches(tokens, haystack) {
    let score = 0;
    for (const token of tokens) {
        if (haystack.includes(token)) {
            score += 1;
        }
    }
    return score;
}

export function rankKnowledgeChunks(query, chunks, topK = 6) {
    const queryTokens = tokenize(query);
    if (!queryTokens.length) {
        return [];
    }

    const ranked = chunks
        .map((chunk) => {
            const bodyScore = countMatches(queryTokens, chunk.content.toLowerCase());
            const titleScore = countMatches(queryTokens, chunk.title.toLowerCase()) * 2;
            const tagScore =
                chunk.tags
                    .map((tag) => tag.toLowerCase())
                    .filter((tag) => queryTokens.includes(tag)).length * 2;

            return {
                chunk,
                score: bodyScore + titleScore + tagScore,
            };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((entry) => entry.chunk);

    return ranked;
}
