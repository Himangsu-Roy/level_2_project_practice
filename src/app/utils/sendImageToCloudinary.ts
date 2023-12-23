import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

export const sendImageToCloudinary = (imageName: string, path: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
    secure: true,
  });

  //   return cloudinary.uploader.upload(
  //     path,
  //     {
  //       public_id: imageName,
  //       use_filename: true,
  //       unique_filename: false,
  //       overwrite: true,
  //       resource_type: 'image',
  //       //   format: 'jpg',
  //       quality: 'auto',
  //       eager: [
  //         {
  //           width: 300,
  //           height: 300,
  //           crop: 'fill',
  //           //   gravity: 'face',
  //           //   radius: 'max',
  //           //   effect: 'sepia',
  //           //   quality: 'auto',
  //           //   format: 'jpg',
  //           //   fetch_format: 'auto',
  //           //   type: 'fetch',
  //           //   background: 'rgb:ffffff',
  //         },
  //       ],
  //     },
  //     (error, result) => {
  //       if (error) {
  //         console.log(error);
  //       }
  //       console.log(result);
  //     },
  //   );

  // return new Promise((resolve, reject) => {
  //   cloudinary.uploader.upload(
  //     path,
  //     {
  //       public_id: imageName,
  //       use_filename: true,
  //       unique_filename: false,
  //       overwrite: true,
  //       resource_type: 'image',
  //     },
  //     (error, result) => {
  //       if (error) {
  //         reject(error);
  //       }
  //       resolve(result);
  //     },
  //   );

  //   // delete a file after uploading to cloudinary
  //   fs.unlink(path, (err) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       console.log('File deleted!');
  //     }
  //   });
  // });

  // return cloudinary.uploader.upload(path, {
  //   public_id: imageName,
  //   use_filename: true,
  //   unique_filename: false,
  //   overwrite: true,
  //   resource_type: 'image',
  //   eager: [
  //     {
  //       width: 300,
  //       height: 300,
  //       crop: 'fill',
  //     },
  //   ],
  // });

  // delete a file after uploading to cloudinary
  //   fs.unlink(path, (err) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       console.log('File deleted!');
  //     }
  //   });

  return cloudinary.uploader.upload(
    path,
    {
      public_id: imageName,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: 'image',
      eager: [
        {
          width: 300,
          height: 300,
          crop: 'fill',
        },
      ],
    },
    (error, result) => {
      if (error) {
        console.log(error);
      }
      // delete a file after uploading to cloudinary
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File deleted!');
        }
      });
      console.log(result);
    },
  );
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
