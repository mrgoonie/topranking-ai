import { Input } from "antd";
import { useState } from "react";

import { api } from "@/plugins/trpc/api";

import SiteButton from "../theme/SiteButton";

const CrawlerTest = () => {
	const [url, setUrl] = useState("wearetopgroup.com");
	const crawl = api.product.crawl.useMutation();

	return (
		<div className="flex gap-2 p-8">
			<Input
				prefix={<span className="text-neutral-500">https://</span>}
				value={url}
				onChange={(e) => setUrl(e.currentTarget.value)}
			/>
			<SiteButton
				onClick={async () => {
					const data = await crawl.mutateAsync(url);
					console.log(`Crawl "${url}" > data :>> `, data);
				}}
			>
				Crawl me!
			</SiteButton>
		</div>
	);
};

export default CrawlerTest;
