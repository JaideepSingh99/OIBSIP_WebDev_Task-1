import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = path.resolve('temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  }
});

export const upload = multer({ storage });
