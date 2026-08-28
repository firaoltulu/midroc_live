import multer from 'multer';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_BYTES_PER_FILE = 10 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_BYTES_PER_FILE,
    files: MAX_FILES_PER_REQUEST,
  },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      return cb(new Error(`Unsupported image type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

export const MAX_IMAGE_BYTES = MAX_BYTES_PER_FILE;
export const MAX_IMAGE_FILES = MAX_FILES_PER_REQUEST;
