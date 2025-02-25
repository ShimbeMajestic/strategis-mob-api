export const awsConfig = {
    accessKeyID: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    defaultRegion: process.env.AWS_DEFAULT_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    baseUrl: process.env.ASSETS_BASE_URL,
};
