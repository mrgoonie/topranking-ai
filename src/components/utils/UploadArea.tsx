import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Typography, Upload } from "antd";
import type { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import { useEffect, useState } from "react";

import type { UploadedFile } from "@/pages/api/upload";

import type { BaseComponentProps } from "../theme/ComponentProps";

export interface UploadAreaProps extends BaseComponentProps {
	multiple?: boolean;
	imageUrl?: string;
	desc?: string;
	onChange?: (images: UploadedFile[]) => void;
}

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/heic", "heic"];
const sizeLimit = 10 * 1024 * 1024; // 10 MB
const uploadUrl = "/api/upload";

const UploadArea = (props?: UploadAreaProps) => {
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploadList, setUploadList] = useState<UploadedFile[]>([]);
	const [loading, setLoading] = useState(false);

	const beforeUpload = (file: RcFile) => {
		if (!props?.multiple) {
			setFileList([]);
			setUploadList([]);
		}
		// console.log("beforeUpload > file :>> ", file);
		const isAllowedType = allowedFileTypes.includes(file.type);
		if (!isAllowedType) {
			alert("You can only upload JPG, JPEG, PNG, or GIF files!");
		}

		const isLt10M = file.size < sizeLimit;
		if (!isLt10M) {
			alert("Image must be smaller than 10MB!");
		}

		return isAllowedType && isLt10M;
	};

	const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
		// console.log("info :>> ", info);
		if (info.fileList.length > 0) setFileList(info.fileList);

		if (info.file.status === "uploading") {
			setLoading(true);
			return;
		}

		// finish (either SUCCESS or FAILURE)
		setLoading(false);

		if (info.file.status === "done") {
			// console.log("info :>> ", info);
			// response data:
			const _uploadList = info.file.response?.data;
			setUploadList(_uploadList);
			if (props?.onChange) props?.onChange(_uploadList);

			// message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === "error") {
			// message.error(`${info.file.name} file upload failed.`);
		}
	};

	// pre-defined image
	useEffect(() => {
		console.log("props?.imageUrl :>> ", props?.imageUrl);
		if (props?.imageUrl) setUploadList([{ publicUrl: props.imageUrl }]);
	}, [props?.imageUrl]);

	// throw callback
	// useEffect(() => {
	// 	if (uploadList && props?.onChange) props?.onChange(uploadList);
	// }, [uploadList]);

	return (
		<div className={`flex flex-col items-center justify-center gap-2 ${props?.className ?? ""}`}>
			{uploadList.length > 0 ? (
				<div
					className="h-[160px] w-[160px] overflow-hidden rounded-md bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: `url(${uploadList[0]?.publicUrl})` }}
				/>
			) : (
				<></>
			)}
			{!uploadList || uploadList.length == 0 ? (
				<Upload
					multiple
					name="files"
					accept="image/*, .heic"
					action={uploadUrl}
					listType="picture-card"
					className="flex overflow-hidden"
					showUploadList={false}
					beforeUpload={beforeUpload}
					onChange={handleChange}
					onRemove={(file) => {
						const index = fileList.indexOf(file);
						const newFileList = fileList.slice();
						newFileList.splice(index, 1);
						setFileList(newFileList);
					}}
					style={{ overflow: "hidden" }}
					fileList={fileList}
				>
					<div>
						{loading ? <LoadingOutlined /> : <PlusOutlined />}
						<div style={{ marginTop: 8 }}>Upload</div>
					</div>
				</Upload>
			) : (
				<></>
			)}
			{props?.desc ? <Typography.Text className="text-xs">{props.desc}</Typography.Text> : null}
		</div>
	);
};

export default UploadArea;
