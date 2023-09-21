import { askAi } from ".";
import { aiModels } from "./ai-api";

/**
 * User AI to extract keywords from an input content
 * @param {string} input
 * @returns {string[]}
 */
export async function classifyKeywords(input) {
	const prompt = `give me the list of main keywords in this paragraph in JSON as { "keywords": [ ... ] }, don't include any explanations in your response: "${input}"`;
	const json = await askAi(prompt, aiModels[0]);
	if (json.error) {
		console.warn(`[AI] Unable to classify keywords.`);
		return [];
	}

	try {
		const result = JSON.parse(json.content?.join(""));
		return result.keywords;
	} catch (e) {
		return [];
	}
}
