"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadToCloudinary = UploadToCloudinary;
const cloudinary_1 = require("cloudinary");
// import fs from "fs";
const sharp_1 = __importDefault(require("sharp"));
// import path from "path";
// import { Readable } from "stream";
cloudinary_1.v2.config({
    cloud_name: "dym0mnyjv",
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});
// export async function UploadToCloudinary(localPath: string) {
//   try {
//     if (!localPath) return null;
//     //Upload to cloudinary
//     const res = await cloudinary.uploader.upload(localPath, {
//       resource_type: "auto",
//     });
//     // Delete file after upload
//     fs.unlink(localPath, (error) => {
//       if (error) console.error("Error while remove local file", error);
//       else console.log("Local file removed");
//     });
//     return res;
//   } catch (error) {
//     console.log("error while upload on cloudinary", error);
//     //Delete local file in case of cloudinary upload fails
//     try {
//       if (fs.existsSync(localPath)) {
//         fs.unlinkSync(localPath);
//         console.log("temp file removed:", localPath);
//       }
//     } catch (e) {
//       console.warn("failed to remove temp file:", e);
//     }
//     return null;
//   }
// }
async function UploadToCloudinary(fileBuffer) {
    try {
        //Optimize buffer in memory
        const optimizedBuffer = await (0, sharp_1.default)(fileBuffer)
            .resize(400, 400, {
            fit: "inside",
            withoutEnlargement: true,
        })
            .jpeg({ quality: 80 })
            .toBuffer();
        //  Convert Buffer to Base64 Data URI
        const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
        //  Upload the string to Cloudinary
        const res = await cloudinary_1.v2.uploader.upload(base64Image, {
            resource_type: "auto",
            folder: "PROFILE",
        });
        // return new Promise((res, rej) => {
        //   const uploadStream = cloudinary.uploader.upload_stream(
        //     {
        //       folder: "uploads",
        //       resource_type: "auto",
        //     },
        //     (error, result) => {
        //       if (error) return rej(error);
        //       res(result as UploadApiResponse);
        //     },
        //   );
        //   const readStream = new Readable();
        //   readStream.push(optimizedBuffer);
        //   readStream.push(null);
        //   readStream.pipe(uploadStream);
        // });
        return res;
    }
    catch (error) {
        console.log("Error while upload to cloudinary", error);
        return null;
    }
}
//# sourceMappingURL=Cloudinary.js.map