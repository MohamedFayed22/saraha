import multer from "multer";
import fs from "node:fs";

export const multer_local = ({
  custom_path = "general",
  custom_types = [],
} = {}) => {
  const full_path = `uploads/${custom_path}`;
  if (!fs.existsSync(full_path)) {
    fs.mkdirSync(full_path, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, full_path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "_" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.type)) {
      cb(new Error("Invalid file type"));
    }
    cb(null, true);
  }

  return multer({ storage, fileFilter });
};
