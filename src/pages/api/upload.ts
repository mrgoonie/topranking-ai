import { Storage } from "@google-cloud/storage";
import multer from "multer";

import { env } from "@/env.mjs";
import { getFileExtension, getFileNameFromURL } from "@/plugins/utils/file-helper";
import { makeSlug } from "@/plugins/utils/slug";

// Configure Google Cloud Storage
// console.log("env.GOOGLE_SERVICE_ACCOUNT :>> ", env.GOOGLE_SERVICE_ACCOUNT);
// console.log("env.GOOGLE_SERVICE_ACCOUNT.replace() :>> ", env.GOOGLE_SERVICE_ACCOUNT?.replace(/\\n/g, "\n"));
const googleSA = env.GOOGLE_SERVICE_ACCOUNT ? JSON.parse(env.GOOGLE_SERVICE_ACCOUNT) : undefined;
// console.log("googleSA :>> ", googleSA);
console.log("googleSA.project_id :>> ", googleSA.project_id);

// const keyFile = path.resolve("gsa.json");
// console.log("keyFile :>> ", keyFile);
// if (env.GOOGLE_SERVICE_ACCOUNT) writeFileSync(keyFile, env.GOOGLE_SERVICE_ACCOUNT);

const storagePath = `topranking-ai`;
const storage = new Storage({
	projectId: googleSA.project_id,
	credentials: googleSA,
	// projectId: "top-group-k8s",
	// keyFile: keyFile,
});
const bucketName = env.GOOGLE_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

// Next.js config to not use default body parser
export const config = { api: { bodyParser: false } };

// Configure Multer
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
});

export interface UploadedFile {
	filename?: string;
	link?: string;
	originalUrl?: string;
	publicUrl: string;
	mimetype?: string;
	size?: number;
}

// Define API Route
const uploadHandler = async (req: any, res: any) => {
	if (req.method !== "POST") return res.status(405).json({ status: 0, message: "Method Not Allowed" });

	// const [buckets] = await storage.getBuckets();
	// console.log("Buckets:");
	// for (const bucket of buckets) console.log(`- ${bucket.name}`);

	try {
		// Handle file upload
		upload.array("files")(req, res, async (err: any) => {
			// console.log("err :>> ", err);
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				return res.status(500).json({ status: 0, message: err.message });
			} else if (err) {
				// An unknown error occurred when uploading.
				return res.status(500).json({ status: 0, message: err.message });
			}

			const files = req.files;
			if (!files) return res.status(400).json({ status: 0, message: "No files to upload." });

			// console.log(`[UPLOAD]`, "files :>> ", files);
			try {
				const uploadedFiles: UploadedFile[] = [];
				const results: UploadedFile[] = await Promise.all(
					files.map(async (file: any) => {
						// extract origin file name and extension
						const fileExt = getFileExtension(file.originalname);
						const originFileName = getFileNameFromURL(file.originalname) || file.originalname;
						const uploadFileName = `${Date.now()}-${makeSlug(originFileName)}${
							fileExt ? `.${fileExt}` : fileExt
						}`;
						const uploadFilePath = `${storagePath}/${uploadFileName}`.toLowerCase();

						// test write to a file in local
						// writeFile(`public/uploads/${uploadFileName}`, file.buffer, (e: any) => {
						// 	if (e) throw e;
						// 	console.log("The file has been saved!");
						// });

						// stream file to upload
						return (async function () {
							return new Promise((resolve, reject) => {
								const blob = bucket.file(uploadFilePath);
								const blobStream = blob.createWriteStream({ resumable: false });

								blobStream
									.on("finish", () => {
										// The public URL can be used to directly access the file via HTTP.
										const originalUrl = `https://storage.googleapis.com/${bucketName}/${uploadFilePath}`;
										const publicUrl = `https://google-cdn.digitop.vn/${uploadFilePath}`;
										// console.log(`[UPLOAD]`, "originalUrl :>> ", originalUrl);
										// console.log(`[UPLOAD]`, "publicUrl :>> ", publicUrl);
										const uploadedFile: UploadedFile = {
											filename: file.originalname,
											link: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
											originalUrl,
											publicUrl,
											mimetype: file.mimetype,
											size: file.buffer.length,
										};
										uploadedFiles.push(uploadedFile);

										resolve(uploadedFile);
									})
									.on("error", (e) => {
										reject(e);
									})
									.end(file.buffer);
							});
						})();
					})
				);

				// console.log("uploadedFiles :>> ", uploadedFiles);
				// console.log("results :>> ", results);
				return res.status(200).json({
					status: 1,
					data: results.map(({ publicUrl, originalUrl, mimetype, size }) => ({
						success: true,
						publicUrl,
						originalUrl,
						mimetype,
						size,
					})),
				});
			} catch (error: any) {
				console.error(`[UPLOAD] Error: `, error.message);
				return res.status(500).json({
					status: 0,
					message: `Unable to upload [${files.map((f: any) => f.originalname)}], something went wrong.`,
				});
			}
		});
	} catch (error: any) {
		console.error(`[UPLOAD] Error:`, error.message);
		return res.status(500).json({ status: 0, message: `Unable to upload, something went wrong.` });
	}
};

export default uploadHandler;
