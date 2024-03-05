"use server";

import OpenAI from "openai";

export async function generateWod(data: FormData) {
  const work = data.get("work");
  const cycles = data.get("cycles");
  const sets = data.get("unique_sets");
  const equipment = data.getAll("equipment");

  console.log(equipment);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a personal trainer. You will be given a set of parameters and intructions and you should generate a work out in a simple bullet list without any further instructions.

          You don't have to use a different exercise for each cycle but each set must be unique.

          You don't have to use all the equipment. Always include at least one body weight exercise and at least one core exercise.

          Work time: ${work} seconds
          Number of exercises per set: ${cycles}
          Sets: ${sets}
          Equipment available: ${equipment.join(", ")}
        `,
      },
      {
        role: "system",
        content: `Work time: ${work}, Number of exercises per set: ${cycles}, Number of sets: ${sets},`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return {
    id: completion.id,
    exercises: completion.choices[0].message.content,
  };
}
