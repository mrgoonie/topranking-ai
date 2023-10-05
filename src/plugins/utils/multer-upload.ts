import Multer from "multer";

const multerStorage = Multer.memoryStorage();

const multerUploads = Multer({
	storage: multerStorage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
}).array("files"); // use .array() for multiple files with the same field name

export default multerUploads;
