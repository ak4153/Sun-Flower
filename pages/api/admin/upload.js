import multer from 'multer';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import nextConnect from 'next-connect';
import onError from '../../../utils/error';

import { isAuthAdmin } from '../../../utils/auth';
//required for upload multi part data from api

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: 'de8ca80ao',
  api_key: '166421373376962',
  api_secret: 'UwOkhRfod1x1Qk5r1T4QeYG4wgw',
});

const handler = nextConnect({ onError });
const upload = multer();
handler.use(isAuthAdmin, upload.single('file')).post(async (req, res) => {
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      console.log(stream);
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const result = await streamUpload(req);
  res.send(result);
});
export default handler;
