import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function setupHelmet(app: INestApplication) {
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
}