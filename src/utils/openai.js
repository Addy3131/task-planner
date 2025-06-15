// src/utils/openai.js
export const getAiTaskSuggestion = async () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a task planner assistant. Suggest short and daily task",
        },
        {
          role: "user",
          content: "Give me one new task suggestion.",
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    }),
  });

  const data = await response.json();
  const task = data.choices?.[0]?.message?.content;
  return task;
};
