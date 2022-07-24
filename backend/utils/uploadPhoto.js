const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
// const getFile = require('./getPreSignedUrl');

const region = process.env.AWS_BUCKET_REGION;
const credentials = {
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
};
const s3 = new S3Client({ region, credentials });

// const storage = multerS3({
//   s3: s3,
//   ACL: 'public-read',
//   bucket: process.env.AWS_BUCKET_NAME,
//   key: function (req, file, cb) {
//     cb(null, `user-${Date.now().toString()}.jpeg`);
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 3 * 1024 * 1024 },
// });
// module.exports = upload;

module.exports = (baseName = 'user') => {
  const storage = multerS3({
    s3: s3,
    ACL: 'public-read',
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `${baseName}-${Date.now().toString()}.jpeg`);
    },
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 },
  });
  return upload;
};
// const getPhotoStorage = function (filename) {};

// AWS.config.update({ credentials: credentials, region });
// const s3obj = new AWS.S3();
// const file = ' 1657036939444.jpeg';
// const presignedGETURL = s3obj.getSignedUrl('getObject', {
//   Bucket: process.env.AWS_BUCKET_NAME,
//   Key: file, //filename
//   Expires: 10000, //time to expire in seconds
// });
// console.log(presignedGETURL);
// app.post('/upload', upload.array('photos', 3), (req, res, next) => {
//   res.send(`Successfully uploaded ${req.files.length} files!`);
// });
/**{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::news-app-profile-pictures/*"
        }
    ]
} */
