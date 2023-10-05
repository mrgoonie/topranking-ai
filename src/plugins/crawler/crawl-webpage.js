import puppeteer from "puppeteer";

/**
 * Crawl a web page URL and return the content.
 *
 * @param {string} url
 * @param {{isDebugging?: boolean; removeHtml?: boolean; removeJsCss?: boolean; removeSpaceTab?: boolean;}} opt
 * @returns {Promise<{title: string; content: string; name: string; description: string; imageUrl: string; images: string[]; icons: string[]; metaData: any;}>}
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
			"--disable-features=site-per-process",
			"--no-first-run",
			"--no-zygote",
			"--single-process",
			"--disable-gpu",
		],
	};

	if (process.env.CHROMIUM_PATH) options.executablePath = process.env.CHROMIUM_PATH;
	// if (!opt?.useExecPath) delete options.executablePath;

	// console.log(`[🐞] crawlWebpage > ${url} > process.env.CHROMIUM_PATH :>> `, process.env.CHROMIUM_PATH);
	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > ${url} > options :>> `, options);

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > ${url} > Web page loaded successfully!`);

	// Catch console.log
	page.on("console", (message) => {
		console.log(`[🐞] crawlWebpage > ${url} > Page log: ${message.text()}`);
	});

	// extract open graph data
	const metaData = await page.evaluate(() => {
		const data = {};
		// Extract og: tags
		const ogTags = document.querySelectorAll('meta[property^="og:"]');
		for (const tag of ogTags) {
			const property = tag.getAttribute("property");
			const content = tag.getAttribute("content");
			if (property && content) {
				data[property] = content;
			}
		}

		// Extract meta description tag
		const descriptionTag = document.querySelector('meta[name="description"]');
		if (descriptionTag) {
			data.description = descriptionTag.getAttribute("content");
		}

		// Extract icons
		const iconTags = document.querySelectorAll('link[rel="icon"]');
		data.icons = [];
		for (const tag of iconTags) {
			const href = tag.getAttribute("href");
			if (href) data.icons.push(href);
		}

		// Extract images
		const imgEles = document.querySelectorAll("img");
		data.images = [];
		for (const tag of imgEles) {
			const imgUrl = tag.getAttribute("src");
			if (imgUrl) data.images.push(imgUrl);
		}

		return data;
	});

	// extract title, desc & content
	const title = await page.title();
	const content = await page.evaluate((_opt) => {
		// console.log("_opt :>> ", JSON.stringify(_opt));

		// Remove all script and style elements
		if (_opt?.removeJsCss) {
			const scriptElements = document.querySelectorAll("script, style");
			scriptElements.forEach((el) => el.remove());
		}

		return !_opt?.removeHtml ? document.body.content : document.body.textContent.trim();
	}, opt);

	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > ${url} > Finished crawling`);

	// close the browser
	try {
		await browser.close();
	} catch (e) {
		console.warn(`[🐞] crawlWebpage > ${url} > Unable to close the browser.`);
	}

	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > ${url} > Browser tab closed`);

	// result data
	const name = metaData["og:title"] || title;
	const description = metaData.description || metaData["og:description"] || "";
	const images = metaData.images || [];
	const imageUrl = metaData["og:image"] || images[0];
	const icons = metaData.icons || [];

	delete metaData.description;
	delete metaData.images;
	delete metaData.icons;

	const data = {
		name,
		title,
		description,
		imageUrl,
		images,
		icons,
		metaData,
		content: !opt.removeSpaceTab ? content : content.replace(/\n|\t/g, " "),
	};
	if (opt?.isDebugging === true) console.log(`[🐞] crawlWebpage > Result data :>>`, data);

	// remove all linebreaks
	return data;
}
