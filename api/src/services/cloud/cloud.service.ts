import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import { cloudConfig } from './cloud.config';
import * as path from 'path'
import * as fs from 'fs'

import { MimeType } from 'mime-type'

interface FilebaseResponse {
	cid: string;
	name: string;
	meta: Object;
}

@Injectable()
export class CloudService {
	private readonly s3Client: S3Client;

	constructor() {
		this.s3Client = new S3Client({
			forcePathStyle: true,
			endpoint: cloudConfig.endpoint,
			region: cloudConfig.region,
			credentials: {
				accessKeyId: cloudConfig.accessKey,
				secretAccessKey: cloudConfig.secretKey,
			},
		});
	}

	async uploadFile(filePath: string): Promise<string> 
	{
		const localFilePath = path.join(process.cwd(), './', `${process.env.UPLOAD_ROOT}${filePath}`);
		
		if (process.env.NODE_ENV === 'development')
			return "http://localhost:3000/images/" + localFilePath;

		const fileContent = fs.readFileSync(localFilePath);
		const mime = new MimeType()
		let contentType = mime.lookup(localFilePath);

		const command = new PutObjectCommand({
			Bucket: cloudConfig.bucketName,
			Key: filePath,
			Body: fileContent,
			ContentType: contentType
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

		let url = `https://bopaduxavinnhoicgnqe.supabase.co/storage/v1/object/public/${cloudConfig.bucketName}/${filePath}`;
		return url;
		
		/*
		const command = new GetObjectCommand({
			Bucket: cloudConfig.bucketName,
			Key: filePath,
		});
		
		const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
		return signedUrl;
		*/
	}

	async deleteFile(filePath: string): Promise<void> {

		if (process.env.NODE_ENV === 'development') return;
		
		const command = new DeleteObjectCommand({
		  Bucket: cloudConfig.bucketName,
		  Key: filePath,
		});
	
		await this.s3Client.send(command);

	  }
}
