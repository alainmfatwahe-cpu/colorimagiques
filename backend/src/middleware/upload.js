// backend/src/middleware/upload.js
// Middleware Multer pour upload de fichiers (PDF + images)
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Stockage PDF
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(UPLOAD_DIR, 'pdfs')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Stockage images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(UPLOAD_DIR, 'images')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Filtre PDF
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
  }
};

// Filtre images
const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format d\'image non supporté (JPEG, PNG, WebP, GIF uniquement)'), false);
  }
};

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800'); // 50 Mo

export const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo par image
});

export const uploadProductFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = file.fieldname.includes('pdf') || file.fieldname.includes('bonus')
        ? path.join(UPLOAD_DIR, 'pdfs')
        : path.join(UPLOAD_DIR, 'images');
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname.includes('pdf') || file.fieldname.includes('bonus')) {
      return pdfFilter(req, file, cb);
    }
    return imageFilter(req, file, cb);
  },
  limits: { fileSize: MAX_FILE_SIZE },
});
