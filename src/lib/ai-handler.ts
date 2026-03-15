import { GoogleGenAI, ThinkingLevel } from "@google/genai";

/**
 * 🔗 AI CORE HANDLER - TAKJILCHAIN
 * Pusat kendali AI dengan sistem Failover (Cadangan Otomatis).
 * Menjamin sistem tetap berjalan meskipun salah satu provider down/limit.
 */

const GEMINI_API_KEY = process.env["GEMINI_API_KEY"];
const OPENROUTER_API_KEY = process.env["OPENROUTER_API_KEY"];
const GROQ_API_KEY = process.env["GROQ_API_KEY"];

/**
 * Lapis 1: Google Gemini (Primary)
 */
async function tryGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text || null;
  } catch (err) {
    console.warn("⚠️ [AI-CORE] Gemini Failed, checking fallbacks...");
    return null;
  }
}

/**
 * Lapis 2: OpenRouter (Claude 3.5 Haiku)
 */
async function tryOpenRouter(prompt: string): Promise<string | null> {
  if (!OPENROUTER_API_KEY) return null;
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-haiku",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn("⚠️ [AI-CORE] OpenRouter Failed...");
    return null;
  }
}

/**
 * Lapis 3: Groq (Llama 3)
 */
async function tryGroq(prompt: string): Promise<string | null> {
  if (!GROQ_API_KEY) return null;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn("⚠️ [AI-CORE] Groq Failed...");
    return null;
  }
}

/**
 * MAIN ENTRY POINT: runAIWithFailover
 * Menjalankan rantai pencarian AI sampai mendapatkan hasil.
 */
export async function runAIWithFailover(prompt: string, fallbackText: string): Promise<string> {
  // 1. Coba Gemini
  let result = await tryGemini(prompt);
  if (result) return result;

  // 2. Coba OpenRouter
  result = await tryOpenRouter(prompt);
  if (result) return result;

  // 3. Coba Groq
  result = await tryGroq(prompt);
  if (result) return result;

  // 4. Emergency Fallback
  console.error("🚨 [AI-CORE] CRITICAL: All AI Engines Failed!");
  return fallbackText;
}
