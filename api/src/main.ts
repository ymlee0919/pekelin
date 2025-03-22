import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import CustomExceptionFactory from './services/validators/customException.factory';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	// Validation pipe
	app.useGlobalPipes(new ValidationPipe({
		// Custom exception
		exceptionFactory: CustomExceptionFactory,
		// Transform body into objects
		transform: true,
		// Skeep not included properties
		whitelist: true,
		// Forbid not included properties
		forbidNonWhitelisted: true,
		// Default error code: 422
		errorHttpStatusCode: 422
	}));

	app.use(cookieParser());

	// Public assets
	let uploadPath = join(__dirname, '../../', 'dist/public');

	if (!existsSync(uploadPath))
		mkdirSync(uploadPath);

	copyFileSync(join(__dirname, '../../', 'public/index.html'), `${uploadPath}/index.html`);

	// Create images folders
	let imagesPath = join(uploadPath, '/images');
	if (!existsSync(imagesPath)) {
		mkdirSync(imagesPath);
		mkdirSync(imagesPath + '/categories');
		mkdirSync(imagesPath + '/products');
	}

	app.useStaticAssets(join(__dirname, '../../', 'public'));

	// CORS
	const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(';') || [];

	app.enableCors({
		origin: allowedOrigins, // Allowed origins
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
		credentials: true, // Allow credentials (e.g., cookies)
	});

	// Helmet
	app.use(
		helmet({
			contentSecurityPolicy: false,
			referrerPolicy: {
				policy: 'strict-origin-when-cross-origin',
			},
			frameguard: { action: 'sameorigin' },
			dnsPrefetchControl: false,
			hidePoweredBy: true,
			hsts: {
				maxAge: 15552000,
				includeSubDomains: true,
				preload: true,
			},
			ieNoOpen: true,
			noSniff: true,
			xssFilter: true,
		}),
	  );

	await app.listen(3000);
}
bootstrap();