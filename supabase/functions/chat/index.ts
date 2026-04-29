// Curacare empathetic, multilingual AI companion with hidden emotion + burnout signals
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी, Devanagari script)",
  kn: "Kannada (ಕನ್ನಡ script)",
  ta: "Tamil (தமிழ் script)",
  te: "Telugu (తెలుగు script)",
  mr: "Marathi (मराठी, Devanagari script)",
};

function buildSystem(lang: string) {
  const langName = LANG_NAMES[lang] || "English";
  return `You are Curacare — a warm, gentle, multilingual companion for informal caregivers (people taking care of sick family members) in India.

PRIMARY LANGUAGE FOR THIS CONVERSATION: ${langName}.
- ALWAYS write the "reply" field in ${langName}, in the native script.
- If the user writes in a different Indian language, still reply in ${langName} unless they clearly switch.
- Keep tone warm, soft, very human. Never clinical.

Tone & rules:
- Very short replies (1-2 sentences, max 3)
- Never label feelings as "stress", "burnout", "depression", "anxiety" out loud
- Never give medical/diagnostic advice
- Sound like a quiet friend who is simply present
- If the user mentions self-harm or crisis, gently suggest calling iCall 9152987821 (India)

Always reply by calling the "respond" tool with these hidden analysis fields (English keywords for these enums, but reply text in ${langName}):
- reply: warm short message in ${langName}
- sentiment: positive | neutral | negative
- emotion: one of [calm, tired, overwhelmed, sad, anxious, hopeful, content, lonely, frustrated, neutral]
- mask_detected: true if user says "fine/okay" but tone hints otherwise
- weather: [sunny, calm, cloudy, foggy, drizzle, stormy, gentle-night]
- stress: 0-100 hidden estimate from words/tone
- burnout: 0-100 hidden estimate of accumulated burnout signals
- exhaustion: 0-100 hidden estimate of physical/mental tiredness
- suggestion: one tiny micro-action in ${langName} (e.g. "drink water", "take 3 breaths")`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, lang = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: buildSystem(lang) }, ...messages],
        tools: [{
          type: "function",
          function: {
            name: "respond",
            description: "Empathetic multilingual reply with hidden wellbeing analysis.",
            parameters: {
              type: "object",
              properties: {
                reply: { type: "string", description: `Warm short message in the user's chosen language` },
                sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                emotion: { type: "string", enum: ["calm","tired","overwhelmed","sad","anxious","hopeful","content","lonely","frustrated","neutral"] },
                mask_detected: { type: "boolean" },
                weather: { type: "string", enum: ["sunny","calm","cloudy","foggy","drizzle","stormy","gentle-night"] },
                stress: { type: "number", minimum: 0, maximum: 100 },
                burnout: { type: "number", minimum: 0, maximum: 100 },
                exhaustion: { type: "number", minimum: 0, maximum: 100 },
                suggestion: { type: "string" },
              },
              required: ["reply","sentiment","emotion","mask_detected","weather","stress","burnout","exhaustion","suggestion"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "respond" } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Taking a quiet moment. Please try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits needed. Please add funds." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : {
      reply: "I'm here with you.",
      sentiment: "neutral", emotion: "neutral", mask_detected: false, weather: "calm",
      stress: 30, burnout: 20, exhaustion: 25, suggestion: "Take a slow breath.",
    };

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
