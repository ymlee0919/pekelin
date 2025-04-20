import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import CustomExceptionFactory from './services/validators/customException.factory';
import * as cookieParser from 'cookie-parser';

import { setupCors } from './security/app/app.cors';
import { setupHelmet } from './security/app/app.helmet';
import { setupStaticAssets } from './app/config/app.staticAssets';

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
		// Default error code: 422
		errorHttpStatusCode: 422
	}));

	app.use(cookieParser());

	// Setup static assets
	setupStaticAssets(app);

	// Setup cors
	setupCors(app);

	// Setup Helmet
	setupHelmet(app);

	await app.listen(3000);
}
bootstrap();