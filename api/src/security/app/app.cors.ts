import { INestApplication } from '@nestjs/common';

export function setupCors(app: INestApplication) {
    // CORS
	const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(';') || [];

	app.enableCors({
		origin: allowedOrigins, // Allowed origins
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
		credentials: true, // Allow credentials (e.g., cookies)
	});
}