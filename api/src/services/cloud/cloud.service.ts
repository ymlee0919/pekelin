import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { cloudConfig } from './cloud.config';
import * as path from 'path'
import * as fs from 'fs'


@Injectable()
export class CloudService {
	private readonly s3Client: S3Client;

	constructor() {
		this.s3Client = new S3Client({
			endpoint: cloudConfig.endpoint,
			region: cloudConfig.region,
			credentials: {
				accessKeyId: cloudConfig.accessKeyId,
				secretAccessKey: cloudConfig.secretAccessKey,
			},
		});
	}

	async uploadFile(filePath: string): Promise<string> 
	{
		if (process.env.NODE_ENV === 'development')
			return "http://localhost:3000/" + filePath;

		const localFilePath = path.join(process.cwd(), './', `${process.env.UPLOAD_ROOT}${filePath}`);

		const fileContent = fs.readFileSync(localFilePath);

		const command = new PutObjectCommand({
			Bucket: cloudConfig.bucketName,
			Key: filePath,
			Body: fileContent,
			ACL: 'public-read', // Make the file publicly accessible
		});

		await this.s3Client.send(command);
		
		// Crear enlace compartido
		const sharedLink = await this.getSharedLink(filePath);
		return sharedLink;
	}

	// Generate a shared link for a file
	async getSharedLink(filePath: string, expiresIn: number = 72000): Promise<string> {

		if (process.env.NODE_ENV === 'development')
			return "http://localhost:3000/" + filePath;

		const command = new GetObjectCommand({
			Bucket: cloudConfig.bucketName,
			Key: filePath,
		});
		
		const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
		return signedUrl;
	}

	async deleteFile(filePath: string): Promise<void> {

		if (process.env.NODE_ENV === 'development')
			return;
		
		const command = new DeleteObjectCommand({
		  Bucket: cloudConfig.bucketName,
		  Key: filePath,
		});
	
		await this.s3Client.send(command);

	  }
}
