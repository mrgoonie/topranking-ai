import { askAi } from ".";
import { aiModels } from "./ai-api";

/**
 * User AI to extract keywords from an input content
 * @param {string} input
 * @returns {string[]}
 */
export async function classifyKeywords(input) {
	const prompt = `give me up to 8 main keywords in this paragraph in JSON format as { "keywords": [ ... ] }, also add to top of the "keywords" array if you think this content is related to one of these following categories:
- Work & Productivity
- Design & Creative
- Architecture
- Interior
- Construction
- Engineering & Development
- Finance
- Social & Community
- Marketing & Sales
- Travel
- Health & Fitness
- Platforms
- Product add-ons
- Physical products
- Web3
- E-commerce
- Family
- Lifestyle
- Education
- Sports
- Manufacturing
- Logistics
- Takeaway
- Automobile
- Robotic
- Gaming
- Cybersecurity
- Entertainment
- Food
- Fashion
- Hospitality
\nDon't include any explanations in your response: \n"${input}"`;

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
