import puppeteer from "puppeteer";

/**
 * Crawl a web page URL and return the content.
 *
 * @param {string} url
 * @param {{useExecPath?: boolean; isDebugging?: boolean; removeHtml?: boolean; removeJsCss?: boolean; removeSpaceTab?: boolean;}} opt
 * @returns {Promise<{title: string; content: string}>}
 */
export async function crawlWebpage(url, opt = {}) {
	/**
	 * @type {import("puppeteer").PuppeteerLaunchOptions}
	 */
	const options = {
		headless: "new",
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
			"--disable-accelerated-2d-canvas",
			"--no-first-run",
			"--no-zygote",
			"--single-process",
			"--disable-gpu",
		],
	};

	if (process.env.CHROMIUM_PATH) options.executablePath = process.env.CHROMIUM_PATH;
	if (!opt.useExecPath) delete options.executablePath;

	// console.log(`[🐞] crawlWebpage > ${url} > process.env.CHROMIUM_PATH :>> `, process.env.CHROMIUM_PATH);
	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > ${url} > options :>> `, options);

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle2" });
	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > ${url} > Web page loaded successfully!`);

	const title = await page.title();
	// const content = await page.content();
	const content = await page.evaluate((_opt) => {
		// Remove all script and style elements
		if (opt.removeJsCss === true || _opt.removeJsCss === true) {
			const scriptElements = document.querySelectorAll("script, style");
			scriptElements.forEach((el) => el.remove());
		}

		return opt.removeHtml === true || _opt.removeHtml === true
			? document.body.content
			: document.body.textContent.trim();
	}, opt);

	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > ${url} > FINISHED!`);

	// close the browser
	await browser.close();

	// remove all linebreaks
	return { title, content: opt.removeSpaceTab === true ? content : content.replace(/\n|\t/g, " ") };
}
