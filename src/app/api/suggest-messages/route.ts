const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

const fallbackQuestions = [
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?",
    "What's the best piece of advice you've ever received?",
    "If you could instantly learn any skill, what would it be?",
    "What's a place you'd love to visit someday?",
    "What's a book, movie, or song that changed how you see things?",
    "What's something small that always brightens your day?",
    "If you could live in any era, which would you pick?",
];

function getFallbackQuestions() {
    return [...fallbackQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
}

function parseQuestions(text: string) {
    return text
        .split("||")
        .map((q) => q.trim().replace(/^['"]|['"]$/g, "").trim())
        .filter(Boolean)
        .slice(0, 3);
}

export async function POST() {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log("GEMINI_API_KEY is not set, returning fallback questions");

        return Response.json({
            success: true,
            message: "Fallback suggestions",
            questions: getFallbackQuestions()
        },
            { status: 200 })
    }

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 1, maxOutputTokens: 300 }
                }),
                signal: AbortSignal.timeout(9000)
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini request failed with status ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();

        const text: string = (data?.candidates?.[0]?.content?.parts ?? [])
            .map((part: { text?: string }) => part.text ?? "")
            .join("");

        const questions = parseQuestions(text);

        if (questions.length < 3) {
            throw new Error(`Unexpected AI output: ${text}`);
        }

        return Response.json({
            success: true,
            message: "Suggestions generated successfully",
            questions
        },
            { status: 200 })

    } catch (error) {

        console.log("Error while generating suggestions, returning fallback questions ", error);

        return Response.json({
            success: true,
            message: "Fallback suggestions",
            questions: getFallbackQuestions()
        },
            { status: 200 })

    }

}
