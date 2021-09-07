import * as dotenv from 'dotenv';

// loading .env file
dotenv.config();

export const storageConfig = {

    s3: {

        accessKeyId: process.env.AWS_ACCESS_KEY_ID,

        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

        region: process.env.AWS_DEFAULT_REGION,

        bucket: process.env.AWS_BUCKET || process.env.AWS_S3_BUCKET_NAME,

        fileSize: 1000 * 1024 * 1024,

        acl: 'public',

    },

    mediaUrl: process.env.MEDIA_URL || `https://${process.env.AWS_BUCKET}.s3.amazonaws.com`,

};
