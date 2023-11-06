import { ArrowRightOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { App, Col, Form, Input, Row, Switch } from "antd";
import { trimEnd } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import GradientHeading from "@/components/theme/GradientHeading";
import SiteButton from "@/components/theme/SiteButton";
import SiteLayout from "@/components/theme/SiteLayout";
import TagsGroup from "@/components/theme/TagsGroup";
import UploadArea from "@/components/utils/UploadArea";
import { api } from "@/plugins/trpc/api";

const UISubmit = () => {
	const router = useRouter();

	const [url, setUrl] = useState(router.query.url);
	const [formVisible, setFormVisible] = useState<boolean>(false);
	const [siteData, setSiteData] = useState<any>();
	console.log("siteData :>> ", siteData);

	const { notification } = App.useApp();

	const crawl = api.product.crawl.useMutation();
	const createProduct = api.product.create.useMutation();
	// console.log("router :>> ", router.query, router.asPath, router.route, router.pathname);

	const onUsingAIChange = (checked: boolean) => {
		setFormVisible(!checked);
	};

	const crawlSiteHandler = async (siteUrl: string) => {
		try {
			const data = await crawl.mutateAsync(siteUrl);
			console.log(`Crawled "${siteUrl}" > data :>> `, data);
			setSiteData(data);
			setFormVisible(true);
		} catch (e: any) {
			notification.error({ message: e.message });
		}
	};

	const onFinish = (values: any) => {
		if (!url) {
			notification.error({ message: "Product URL is required." });
			return;
		}
		if (!siteData?.images || siteData?.images?.length == 0) {
			notification.error({ message: "Product's photo is required." });
			return;
		}
		if (!siteData?.keywords || siteData?.keywords?.length == 0) {
			notification.error({ message: "Keywords are required." });
			return;
		}
		// console.log("Submiting:", values);
		console.log("siteData :>> ", siteData);

		setFormVisible(false);

		createProduct
			.mutateAsync({
				url: url.toString(),
				title: values.title || siteData.title,
				desc: values.description || siteData.description,
				intro: values.description || siteData.description,
				content: values.summary || siteData.summary,
				keywords: siteData.keywords,
				tags: siteData.keywords,
				categoryList: siteData.keywords,
				images: siteData.images.filter((img) => typeof img !== "undefined"),
				imageUrl: siteData.imageUrl,
			})
			.then((newProduct) => {
				// console.log("newProduct :>> ", newProduct);
				router.push(`/submit-success`);
			})
			.catch((e: any) => {
				console.log("e :>> ", e);
				notification.error({ message: `Unable to create a product: ${e.message}` });
				setFormVisible(true);
			});
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
		// notification.error({ message: `Unable to create a product: ${errorInfo.message}` });
	};

	useEffect(() => {
		if (typeof router.query.url !== "undefined" && !siteData) {
			let siteUrl = router.query.url.toString();
			siteUrl = trimEnd(siteUrl, "/");
			if (siteUrl.startsWith("https://")) siteUrl = siteUrl.replaceAll(new RegExp("https://", "gi"), "");
			if (siteUrl.startsWith("http://")) siteUrl = siteUrl.replaceAll(new RegExp("http://", "gi"), "");

			setUrl(siteUrl);
			crawlSiteHandler(siteUrl);
		}
	}, [router.query.url]);

	return (
		<SiteLayout protected>
			<div className="grow" />
			<div className="relative flex min-h-[413px] w-full flex-col overflow-hidden rounded-[20px] bg-neutral-950 md:flex-row">
				<div className="flex-grow">
					<div className="inline-flex w-full flex-col items-center justify-start gap-6 p-16">
						<GradientHeading>Submit an AI product</GradientHeading>

						{/* 👇 PRELOADER */}

						{crawl.isLoading || createProduct.isLoading ? (
							<div className="text-center">Please wait, our AI assistant is analyzing the website...</div>
						) : (
							<div className="mb-10 w-full text-center">
								Found a cool AI-powered product you want everyone to know about? Or maybe you made one
								yourself and want the world to know about it? You&apos;re in the right place.
							</div>
						)}

						<div
							className={`flex w-full max-w-lg flex-col items-center justify-center gap-4 text-2xl md:flex-row ${
								!siteData && (crawl.isLoading || createProduct.isLoading) ? "" : "hidden"
							}`}
						>
							<LoadingOutlined />
						</div>

						{/* 👇 UPLOAD PHOTO */}

						{formVisible ? (
							<Row>
								<Col span={6} />
								<Col span={18}>
									<UploadArea
										desc="Click to upload"
										imageUrl={siteData?.imageUrl}
										onChange={(images) => {
											if (images.length > 0) {
												const imgArr = images.map((img) => img.publicUrl);
												setSiteData((_siteData) => ({
													..._siteData,
													imageUrl: imgArr[0],
													images:
														_siteData && _siteData.images
															? [..._siteData.images, ...imgArr]
															: imgArr,
												}));
											}
										}}
									/>
								</Col>
							</Row>
						) : null}

						{/* 👇 URL INPUT FORM */}

						<div
							className={`antd-row flex w-full max-w-xl flex-col items-stretch md:flex-row ${
								crawl.isLoading || createProduct.isLoading ? "hidden" : ""
							}`}
						>
							{formVisible ? (
								<label style={{ flex: "0 0 25%" }} className="flex items-center pr-2 text-right">
									<span className="w-full">Website:</span>
								</label>
							) : null}

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
								onPressEnter={(e) => {
									e.preventDefault();
									setSiteData(undefined);
									router.push(`${router.route}/?url=${url}`);
								}}
							/>

							{!formVisible ? (
								<SiteButton
									className="ml-4"
									leadIcon={<ArrowRightOutlined />}
									fullWidth
									onClick={(e) => {
										e.preventDefault();
										setSiteData(undefined);
										router.push(`${router.route}/?url=${url}`);
									}}
								>
									Analyze
								</SiteButton>
							) : null}
						</div>

						{/* 👇 PREVIEW */}

						{formVisible ? (
							<Form
								name="product"
								labelCol={{ span: 6 }}
								wrapperCol={{ span: 18 }}
								onFinish={onFinish}
								onFinishFailed={onFinishFailed}
								className="w-full max-w-xl"
							>
								<Form.Item name="title" initialValue={siteData?.title} label="Title">
									<Input />
								</Form.Item>
								<Form.Item name="description" initialValue={siteData?.description} label="Description">
									<Input />
								</Form.Item>
								<Form.Item name="summary" initialValue={siteData?.summary} label="Summary">
									<Input.TextArea />
								</Form.Item>
								<Form.Item
									name="imageUrl"
									initialValue={siteData?.metaData ? siteData?.metaData["og:image"] : undefined}
									hidden
								>
									<Input hidden />
								</Form.Item>
								<Form.Item label="Tags">
									<TagsGroup
										defaultValue={siteData?.keywords}
										onChange={(tags) =>
											tags?.length > 0
												? setSiteData((_) => ({ ..._, keywords: tags }))
												: undefined
										}
									/>
								</Form.Item>
								<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
									<SiteButton htmlType="submit">Submit now</SiteButton>
								</Form.Item>
							</Form>
						) : null}

						{!siteData && !crawl.isLoading && !createProduct.isLoading ? (
							<div className="inline-flex w-full max-w-lg gap-3 text-sm">
								<Switch defaultChecked={!formVisible} onChange={onUsingAIChange} />

								{!formVisible ? (
									<p>
										Use our AI to extract information from this website to categorize it, this
										process might take up to a minute.
									</p>
								) : (
									<p>
										I would rather to provide this product information manually.
										<br />
										&nbsp;
									</p>
								)}
							</div>
						) : null}
					</div>
				</div>
				<div
					className="min-h-[200px] w-full bg-cover bg-center bg-no-repeat md:w-1/3"
					style={{ backgroundImage: `url(/images/illustration-01.png)` }}
				/>
			</div>
		</SiteLayout>
	);
};

export default UISubmit;
