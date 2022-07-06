const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const getFile = require('./getPreSignedUrl');

const region = process.env.AWS_BUCKET_REGION;
const credentials = {
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
};
const s3 = new S3Client({ region, credentials });

const upload = multer({
  storage: multerS3({
    s3: s3,
    ACL: 'public-read',
    bucket: process.env.AWS_BUCKET_NAME,
    // metadata: function (req, file, cb) {
    //   cb(null, { fieldName: file.fieldname });
    // },
    key: function (req, file, cb) {
      cb(null, ` ${Date.now().toString()}.jpeg`);
    },
  }),
});
// AWS.config.update({ credentials: credentials, region });
// const s3obj = new AWS.S3();
// const file = ' 1657036939444.jpeg';
// const presignedGETURL = s3obj.getSignedUrl('getObject', {
//   Bucket: process.env.AWS_BUCKET_NAME,
//   Key: file, //filename
//   Expires: 10000, //time to expire in seconds
// });
// console.log(presignedGETURL);
getFile(' 1657036939444.jpeg');
module.exports = upload;
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
