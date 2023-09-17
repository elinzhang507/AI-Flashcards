import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  
  const notes = req.body.notes || '';
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(notes),
      temperature: 1,
      max_tokens:3600
    });

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
}

}

function generatePrompt(notes) {
  return `Take the notes and turn them into 3 flashcards. Emphasis on 3. Also importantly: When writing the flash cards, make sure they have a Question: Answer: format for all 3 cards.

Question: Explain the concept of convergence in spectral lines. Why do lines get closer as frequency increases?
Answer: Convergence refers to the phenomenon where spectral lines get closer together as frequency increases and wavelength decreases. This occurs because energy levels in atoms become closer as you move to higher energies, leading to line convergence.
Question: Define supply and demand
Answer: The fundamental concept in economics that describes how the availability of a product (supply) and the desire for that product (demand) interact to determine its price and quantity sold.
Question: How does socialization influence an individual's sense of self and identity? Provide examples of socialization agents and their impact.
Answer: Socialization is the process through which individuals learn and internalize the norms, values, and behaviors of their culture or society. Socialization agents include family, peers, schools, media, and religion. For example, family teaches children their culture's language, values, and customs, which shape their identity.
Question: ${notes}
Answer:`;
}
