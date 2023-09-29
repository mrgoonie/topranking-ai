// routers/api.ts
import { Storage } from "@google-cloud/storage";
import * as z from "zod";

import { env } from "@/env.mjs";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Configure Google Cloud Storage
const googleSA = env.GOOGLE_SERVICE_ACCOUNT ? JSON.parse(env.GOOGLE_SERVICE_ACCOUNT) : undefined;

const storagePath = `/topranking-ai/upload`;
const storage = new Storage({
	projectId: googleSA.project_id,
	credentials: googleSA,
});
const bucketName = env.GOOGLE_STORAGE_BUCKET ?? "digitop-cdn-sg";
const bucket = storage.bucket(bucketName);

// Input validator
const UploadInput = z.object({
	file: z.object({
		mimetype: z.string().optional(),
		buffer: z.instanceof(Buffer),
	}),
});

export const imageRouter = createTRPCRouter({
	upload: protectedProcedure.input(UploadInput).mutation(async ({ input, ctx }) => {
		console.log("[upload] input :>> ", input);
		const { file } = input;
		console.log("[upload] file.mimetype :>> ", file.mimetype);

		// Generating a unique filename
		const filename = `${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
		const fileBlob = bucket.file(filename);

		// Stream the file to the GCS bucket
		const stream = fileBlob.createWriteStream({
			metadata: {
				contentType: file.mimetype,
			},
		});

		return new Promise((resolve, reject) => {
			stream.on("error", (err) => reject(err));
			stream.on("finish", () => {
				// The public URL can be used to directly access the file via HTTP.
				const publicUrl = `https://storage.googleapis.com/${bucketName}${storagePath}/${filename}`;
				resolve({
					success: true,
					url: publicUrl,
					mimetype: file.mimetype,
					size: file.buffer.length,
				});
			});
			stream.end(file.buffer);
		});
	}),
});
