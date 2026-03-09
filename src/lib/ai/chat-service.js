import { generateGemmaContent } from "./gemma-client.js";

function detectLanguageHint(question) {
    const vietnamesePattern =
        /[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
    return vietnamesePattern.test(question) ? "vi" : "en";
}

function toContextBlock(chunks) {
    if (!chunks.length) {
        return "No project context retrieved.";
    }

    return chunks
        .map((chunk, index) => {
            const source = chunk.url || chunk.sourcePath || "unknown-source";
            return [
                `[[DOC_${index + 1}]]`,
                `title: ${chunk.title}`,
                `source: ${source}`,
                `content: ${chunk.content}`,
            ].join("\n");
        })
        .join("\n\n");
}

function normalizeHistory(messages) {
    return messages
        .slice(-8)
        .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
        .join("\n");
}

export async function generateStrictAnswer({ messages, chunks }) {
    const lastUserMessage =
        [...messages].reverse().find((message) => message.role === "user")
            ?.content || "";
    const languageHint = detectLanguageHint(lastUserMessage);

    const systemRules =
        languageHint === "vi"
            ? [
                  "Bạn là trợ lý dự án microservice communication.",
                  "Ưu tiên trả lời theo CONTEXT được cung cấp.",
                  "Nếu CONTEXT chưa đủ, có thể mở rộng bằng kiến thức chuẩn về microservices và distributed systems.",
                  "Không cần đưa mục trích dẫn nguồn.",
                  "Trả lời ngắn gọn, thực tế, có cấu trúc dễ đọc.",
              ].join(" ")
            : [
                  "You are the microservice communication project assistant.",
                  "Prioritize answers from the provided CONTEXT.",
                  "If context is insufficient, you may expand with standard microservices and distributed systems knowledge.",
                  "Do not include source citation blocks.",
                  "Keep the answer concise and practical.",
              ].join(" ");

    const prompt = [
        `SYSTEM RULES: ${systemRules}`,
        "",
        "CONTEXT:",
        toContextBlock(chunks),
        "",
        "CONVERSATION:",
        normalizeHistory(messages),
        "",
        `USER QUESTION: ${lastUserMessage}`,
        "",
        "Provide a concise answer without source citation section.",
    ].join("\n");

    return generateGemmaContent(prompt);
}
