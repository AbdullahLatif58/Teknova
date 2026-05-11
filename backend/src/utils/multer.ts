import multer from "multer";


export const storeWithMulter = (_folderName: string) => {
  return multer({ storage: multer.memoryStorage() });
};