import { serve } from "https://deno.land/std/http/server.ts";
import "https://deno.land/x/dotenv/load.ts";

// Load the environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Helper function to call OpenAI API
const fetchGPTResponse = async (prompt) => {
  if (!OPENAI_API_KEY) {
    console.error("Missing OpenAI API Key");
    return "Error: No API Key";
  }

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
};

// Server handler
const handler = async (req) => {
  const url = new URL(req.url);

  // Serve static files
  if (url.pathname === "/") {
    const file = await Deno.readTextFile("./public/index.html");
    return new Response(file, { headers: { "Content-Type": "text/html" } });
  } else if (url.pathname.startsWith("/public")) {
    try {
      const filePath = `.${url.pathname}`;
      const file = await Deno.readFile(filePath);
      const contentType = filePath.endsWith(".css")
        ? "text/css"
        : filePath.endsWith(".js")
        ? "application/javascript"
        : "text/plain";
      return new Response(file, { headers: { "Content-Type": contentType } });
    } catch (e) {
      return new Response("File not found", { status: 404 });
    }
  }

  // Handle budget API route
  if (url.pathname === "/api/generate-budget" && req.method === "POST") {
    const body = await req.json();
    const { university, background, income, expenses } = body;

    // Generate a dynamic GPT prompt
    const prompt = `
      Create a monthly budget for a student:
      - University: ${university}
      - Parents' Profession: ${background}
      - Monthly Income: ${income || "unknown"}
      - Monthly Expenses: ${expenses || "unknown"}

      Provide a breakdown for Rent, Food, Fun, and Savings.
    `;

    // Get GPT response
    const budget = await fetchGPTResponse(prompt);

    return new Response(JSON.stringify({ budget }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Return 404 for unknown routes
  return new Response("Not Found", { status: 404 });
};

console.log("Server running on http://localhost:8000");
serve(handler, { port: 8000 });

  