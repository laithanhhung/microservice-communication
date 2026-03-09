import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const patternsDir = path.join(projectRoot, "src", "content", "patterns");
const referenceFile = path.join(
    projectRoot,
    "src",
    "content",
    "references",
    "bytebytego-crash-course.md",
);

let cachedChunks = null;

function stripFrontmatter(raw) {
    return raw.replace(/^---[\s\S]*?---\s*/m, "").trim();
}

function parseTitle(raw, fallbackTitle) {
    const match = raw.match(/^title:\s*["'](.+?)["']\s*$/m);
    return match?.[1]?.trim() || fallbackTitle;
}

function parseSourceUrl(raw) {
    const match = raw.match(/^sourceUrl:\s*["'](.+?)["']\s*$/m);
    return match?.[1]?.trim();
}

function normalizeText(markdown) {
    return markdown
        .replace(/`{1,3}[\s\S]*?`{1,3}/g, " ")
        .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
        .replace(/\[[^\]]+]\([^)]+\)/g, " ")
        .replace(/[#>*_\-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function filenameToTags(filename) {
    return filename
        .replace(/\.md$/i, "")
        .split("-")
        .filter(Boolean);
}

async function loadPatternChunks() {
    const entries = await readdir(patternsDir, { withFileTypes: true });
    const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => entry.name);

    const chunks = await Promise.all(
        files.map(async (filename) => {
            const filePath = path.join(patternsDir, filename);
            const raw = await readFile(filePath, "utf8");
            const title = parseTitle(raw, filename.replace(/\.md$/i, ""));
            const content = normalizeText(stripFrontmatter(raw));

            return {
                id: `pattern:${filename}`,
                title,
                sourceType: "repo",
                sourcePath: `src/content/patterns/${filename}`,
                tags: filenameToTags(filename),
                content,
            };
        }),
    );

    return chunks;
}

async function loadReferenceChunk() {
    const raw = await readFile(referenceFile, "utf8");
    const title = parseTitle(raw, "ByteByteGo Crash Course Summary");
    const content = normalizeText(stripFrontmatter(raw));
    const sourceUrl = parseSourceUrl(raw);

    return {
        id: "reference:bytebytego-crash-course",
        title,
        sourceType: "reference",
        sourcePath: "src/content/references/bytebytego-crash-course.md",
        url: sourceUrl,
        tags: ["bytebytego", "communication", "patterns"],
        content,
    };
}

export async function loadKnowledgeChunks() {
    if (cachedChunks) {
        return cachedChunks;
    }

    const [patterns, reference] = await Promise.all([
        loadPatternChunks(),
        loadReferenceChunk(),
    ]);

    cachedChunks = [...patterns, reference];
    return cachedChunks;
}

export function resetKnowledgeCacheForTests() {
    cachedChunks = null;
}
