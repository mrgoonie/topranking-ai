import type { RcFile } from "antd/lib/upload";

export const fileToBuffer = (file: RcFile): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = () => {
			if (reader.result instanceof ArrayBuffer) {
				resolve(Buffer.from(reader.result));
			} else {
				reject(new Error("Unexpected result while converting file to buffer"));
			}
		};

		reader.onerror = (error) => {
			reject(error);
		};
	});
};
