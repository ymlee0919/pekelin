export const cloudConfig = {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY, // Replace with your Filebase access key
    secretAccessKey: process.env.FILEBASE_SECRET_KEY, // Replace with your Filebase secret key
    endpoint: 'https://s3.filebase.com', // Filebase S3 endpoint
    region: 'us-east-1', // Filebase uses us-east-1 as the default region
    bucketName: process.env.FILEBASE_BUCKET_NAME, // Replace with your Filebase bucket name
};