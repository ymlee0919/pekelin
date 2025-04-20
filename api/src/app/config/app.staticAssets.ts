import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync, copyFileSync } from 'fs';

export function setupStaticAssets(app: NestExpressApplication) {
    // Public assets
	let uploadPath = join(__dirname, '../../../../', 'dist/public');

	if (!existsSync(uploadPath))
		mkdirSync(uploadPath);

	copyFileSync(join(__dirname, '../../../../', 'public/index.html'), `${uploadPath}/index.html`);

	// Create images folders
	let imagesPath = join(uploadPath, '/images');
	if (!existsSync(imagesPath)) {
		mkdirSync(imagesPath);
		mkdirSync(imagesPath + '/categories');
		mkdirSync(imagesPath + '/products');
	}

	app.useStaticAssets(join(__dirname, '../../../../', 'public'));
}