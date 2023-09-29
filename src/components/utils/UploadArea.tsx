import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Typography, Upload } from "antd";
import type { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import { useEffect, useState } from "react";

import { AppConfig } from "@/config/AppConfig";

import type { BaseComponentProps } from "../theme/ComponentProps";

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const sizeLimit = 10 * 1024 * 1024; // 10 MB

export interface UploadAreaProps extends BaseComponentProps {
	imageUrl?: string;
	desc?: string;
	onChange?: (imageUrl: string) => void;
}

const UploadArea = (props?: UploadAreaProps) => {
	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState(props?.imageUrl);

	const beforeUpload = (file: RcFile) => {
		const isAllowedType = allowedFileTypes.includes(file.type);
		if (!isAllowedType) {
			message.error("You can only upload JPG, JPEG, PNG, or GIF files!");
		}

		const isLt10M = file.size < sizeLimit;
		if (!isLt10M) {
			message.error("Image must be smaller than 10MB!");
		}

		return isAllowedType && isLt10M;
	};

	const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
		if (info.file.status === "uploading") {
			setLoading(true);
			return;
		}

		// finish (either SUCCESS or FAILURE)
		setLoading(false);

		if (info.file.status === "done") {
			console.log("info :>> ", info);
			// info.file.url
			setImageUrl(info.file.response?.url);
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
	};

	useEffect(() => {
		setImageUrl(props?.imageUrl);
	}, [props?.imageUrl]);

	useEffect(() => {
		if (imageUrl && props?.onChange) props.onChange(imageUrl);
	}, [imageUrl]);

	return (
		<div className="flex flex-row items-center">
			<Upload
				name="file"
				action={AppConfig.getBaseUrl("/api/upload")}
				listType="picture-card"
				className="flex overflow-hidden"
				showUploadList={false}
				beforeUpload={beforeUpload}
				onChange={handleChange}
				style={{ overflow: "hidden" }}
			>
				{imageUrl ? (
					<img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
				) : (
					<div>
						{loading ? <LoadingOutlined /> : <PlusOutlined />}
						<div style={{ marginTop: 8 }}>Upload</div>
					</div>
				)}
			</Upload>
			{props?.desc ? <Typography.Text className="text-xs">{props.desc}</Typography.Text> : null}
		</div>
	);
};

export default UploadArea;
