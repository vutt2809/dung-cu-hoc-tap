const AWS = require('aws-sdk');

const keys = require('../config/keys');

exports.s3Upload = async image => {
  try {
    let image_url = '';
    let image_key = '';

    if (!keys.aws.accessKeyId) {
      console.warn('Missing aws keys');
    }

    if (image) {
      const s3bucket = new AWS.S3({
        accessKeyId: keys.aws.accessKeyId,
        secretAccessKey: keys.aws.secretAccessKey,
        region: keys.aws.region
      });

      const params = {
        Bucket: keys.aws.bucketName,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: image.mimetype
      };

      const s3Upload = await s3bucket.upload(params).promise();

      image_url = s3Upload.Location;
      image_key = s3Upload.key;
    }

    return { image_url, image_key };
  } catch (error) {
    return { image_url: '', image_key: '' };
  }
};
