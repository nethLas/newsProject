const AWS = require('aws-sdk');

module.exports = (fileName) => {
  const region = process.env.AWS_BUCKET_REGION;
  const credentials = {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
  };
  AWS.config.update({ credentials: credentials, region });
  const s3obj = new AWS.S3();

  const presignedGETURL = s3obj.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName, //filename
    Expires: 10000, //time to expire in seconds
  });
  console.log(presignedGETURL);
  return presignedGETURL;
};
