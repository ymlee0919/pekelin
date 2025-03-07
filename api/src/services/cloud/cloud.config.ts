export const cloudConfig = {
    accessKey: process.env.ACCESS_KEY, // Replace with your Filebase access key
    secretKey: process.env.SECRET_KEY, // Replace with your Filebase secret key
    endpoint: process.env.S3_ENPOINT, // Filebase S3 endpoint
    region: process.env.S3_REGION, // Filebase uses us-east-1 as the default region
    bucketName: process.env.BUCKET_NAME // Replace with your Filebase bucket name
};