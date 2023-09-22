import { ArrowRightOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Input, notification, Tag } from "antd";
import { trimEnd } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import MasterPageAuth from "@/components/layouts/MasterPageAuth";
import GradientHeading from "@/components/theme/GradientHeading";
import SiteButton from "@/components/theme/SiteButton";
import SiteLayout from "@/components/theme/SiteLayout";
import { api } from "@/plugins/trpc/api";

export default function Submit() {
	const router = useRouter();
	const [url, setUrl] = useState(router.query.url);
	const [siteData, setSiteData] = useState<any>();
	const crawl = api.product.crawl.useMutation();
	const createProduct = api.product.create.useMutation();
	// console.log("router :>> ", router.query, router.asPath, router.route, router.pathname);

	const crawlSiteHandler = async (siteUrl: string) => {
		setSiteData(undefined);
		try {
			const data = await crawl.mutateAsync(siteUrl);
			console.log(`Crawled "${siteUrl}" > data :>> `, data);
			setSiteData(data);
		} catch (e: any) {
			notification.error({ message: e.message });
		}
	};

	const onFinish = (values: any) => {
		console.log("Submiting:", values);

		createProduct
			.mutateAsync({
				...values,
				url,
				content: siteData.summary,
				keywords: siteData.keywords,
				tags: siteData.keywords,
				categoryList: siteData.keywords,
			})
			.then((newProduct) => {
				console.log("newProduct :>> ", newProduct);
				router.push(`/submit-success`);
			})
			.catch((e) => console.log("e :>> ", e));
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	useEffect(() => {
		if (typeof router.query.url !== "undefined") {
			let siteUrl = router.query.url.toString();
			siteUrl = trimEnd(siteUrl, "/");
			if (siteUrl.startsWith("https://")) siteUrl = siteUrl.replaceAll(new RegExp("https://", "gi"), "");
			if (siteUrl.startsWith("http://")) siteUrl = siteUrl.replaceAll(new RegExp("http://", "gi"), "");
			setUrl(siteUrl);
			crawlSiteHandler(siteUrl);
		}
	}, [router.query.url]);

	return (
		<MasterPageAuth meta={{ title: "Submit your AI" }}>
			<SiteLayout>
				<div className="grow" />
				<div className="relative flex min-h-[413px] w-full flex-col overflow-hidden rounded-[20px] bg-neutral-950 md:flex-row">
					<div className="flex-grow">
						<div className="inline-flex w-full flex-col items-center justify-start gap-6 p-16">
							<GradientHeading>Submit an AI product</GradientHeading>
							{crawl.isLoading || createProduct.isLoading ? (
								<div>Please wait, our AI assistant is analyzing the website...</div>
							) : (
								<div className="mb-10 w-full text-center">
									Found a cool AI-powered product you want everyone to know about? Or maybe you made
									one yourself and want the world to know about it? You&apos;re in the right place.
								</div>
							)}
							<div
								className={`flex w-full max-w-lg flex-col items-center justify-center gap-4 text-2xl md:flex-row ${
									crawl.isLoading || createProduct.isLoading ? "" : "hidden"
								}`}
							>
								<LoadingOutlined />
							</div>
							<div
								className={`flex w-full max-w-lg flex-col gap-4 md:flex-row ${
									crawl.isLoading || createProduct.isLoading ? "hidden" : ""
								}`}
							>
								<Input
									placeholder="www.example.com"
									prefix={<span className="text-neutral-500">https://</span>}
									size="large"
									value={url}
									onChange={(e) => {
										let siteUrl = e.currentTarget.value.trimEnd();
										siteUrl = trimEnd(siteUrl, "/");
										if (siteUrl.startsWith("https://"))
											siteUrl = siteUrl.replaceAll(new RegExp("https://", "gi"), "");
										if (siteUrl.startsWith("http://"))
											siteUrl = siteUrl.replaceAll(new RegExp("http://", "gi"), "");
										setUrl(siteUrl);
									}}
								/>
								<SiteButton
									leadIcon={<ArrowRightOutlined />}
									// href="/submit-success"
									fullWidth
									onClick={() => router.push(`${router.route}/?url=${url}`)}
								>
									{typeof siteData === "undefined" ? "Submit" : "Reload"}
								</SiteButton>
							</div>

							{/* PREVIEW */}
							{typeof siteData !== "undefined" && !createProduct.isLoading ? (
								<Form
									name="product"
									labelCol={{ span: 8 }}
									wrapperCol={{ span: 16 }}
									onFinish={onFinish}
									onFinishFailed={onFinishFailed}
								>
									<Form.Item name="title" initialValue={siteData?.title} label="Title">
										<Input />
									</Form.Item>
									<Form.Item name="desc" initialValue={siteData?.description} label="Description">
										<Input />
									</Form.Item>
									<Form.Item name="intro" initialValue={siteData?.summary} label="Summary">
										<Input.TextArea />
									</Form.Item>
									<Form.Item name="imageUrl" initialValue={siteData?.metaData["og:image"]} hidden>
										<Input hidden />
									</Form.Item>
									<Form.Item label="Tags">
										{siteData?.keywords.map((keyword: any) => <Tag key={keyword}>{keyword}</Tag>)}
									</Form.Item>
									<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
										<SiteButton htmlType="submit">Submit now</SiteButton>
									</Form.Item>
								</Form>
							) : null}

							<div className="inline-flex max-w-lg gap-3 text-sm">
								<InfoCircleOutlined />
								<p>
									{" "}
									We use AI to extract information from this website to categorize it, please make
									sure your website contains enough information.
								</p>
							</div>
						</div>
					</div>
					<div
						className="min-h-[200px] w-full bg-cover bg-center bg-no-repeat md:w-1/3"
						style={{ backgroundImage: `url(/images/illustration-01.png)` }}
					/>
				</div>
			</SiteLayout>
		</MasterPageAuth>
	);
}
