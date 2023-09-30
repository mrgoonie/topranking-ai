/* eslint-disable import/no-extraneous-dependencies */
import { Storage } from "@google-cloud/storage";
import multer from "multer";

import { env } from "@/env.mjs";

// Configure Google Cloud Storage
console.log("env.GOOGLE_SERVICE_ACCOUNT :>> ", env.GOOGLE_SERVICE_ACCOUNT);
// console.log("env.GOOGLE_SERVICE_ACCOUNT.replace() :>> ", env.GOOGLE_SERVICE_ACCOUNT?.replace(/\\n/g, "\n"));
const googleSA = env.GOOGLE_SERVICE_ACCOUNT ? JSON.parse(env.GOOGLE_SERVICE_ACCOUNT) : undefined;
// console.log("googleSA :>> ", googleSA);

// const keyFile = path.resolve("gsa.json");
// console.log("keyFile :>> ", keyFile);
// if (env.GOOGLE_SERVICE_ACCOUNT) writeFileSync(keyFile, env.GOOGLE_SERVICE_ACCOUNT);

const storagePath = `/topranking-ai/upload`;
const storage = new Storage({
	projectId: googleSA.project_id,
	credentials: googleSA,
	// projectId: "top-group-k8s",
	// keyFile: keyFile,
});
const bucketName = env.GOOGLE_STORAGE_BUCKET ?? "digitop-cdn-sg";

// Next.js config to not use default body parser
export const config = { api: { bodyParser: false } };

// Configure Multer
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
});

// Define API Route
const uploadHandler = async (req: any, res: any) => {
	if (req.method !== "POST") return res.status(405).json({ status: 0, message: "Method Not Allowed" });

	try {
		// Handle file upload
		upload.single("file")(req, res, async (err: any) => {
			// console.log("err :>> ", err);
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				return res.status(500).json({ status: 0, message: err.message });
			} else if (err) {
				// An unknown error occurred when uploading.
				return res.status(500).json({ status: 0, message: err.message });
			}

			const file = req.file;
			if (!file) return res.status(400).json({ status: 0, message: "No file uploaded." });

			console.log("file :>> ", file);
			try {
				// Create a writable stream to Google Cloud Storage Bucket
				const fileName = `${storagePath}/${Date.now()}-${file.originalname}`;
				const bucketFile = storage.bucket(bucketName).file(fileName);

				await bucketFile.save(file.buffer, {
					contentType: file.mimetype,
					public: true, // If you want to make the file publicly accessible
				});

				// The public URL can be used to directly access the file via HTTP.
				const originalUrl = `https://storage.googleapis.com/${bucketName}${fileName}`;
				const publicUrl = `https://google-cdn.digitop.vn${fileName}`;
				console.log("originalUrl :>> ", originalUrl);
				console.log("publicUrl :>> ", publicUrl);

				return res.status(200).json({
					status: 1,
					success: true,
					url: publicUrl,
					originalUrl,
					mimetype: file.mimetype,
					size: file.buffer.length,
				});
			} catch (error: any) {
				console.error(error.message);
				return res
					.status(500)
					.json({ status: 0, message: `Unable to upload ${file.originalname}, something went wrong.` });
			}
		});
	} catch (error: any) {
		console.error(error.message);
		return res.status(500).json({ status: 0, message: `Unable to upload, something went wrong.` });
	}
};

export default uploadHandler;
