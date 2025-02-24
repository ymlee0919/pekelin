import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';

import { DatabaseModule } from 'src/services/database/database.module';

import { AccountsModule } from './accounts/accounts.module';
import { ProductsModule } from './products/products.module';
import { ApplicationModule } from './app/application.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { VariantsModule } from './variants/variants.module';

@Module({
	imports: [
		DatabaseModule, 
		AccountsModule, 
		AuthModule,
		ApplicationModule,
		ProductsModule,
		VariantsModule,
		CategoriesModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '8h' },
		}),
	],
	providers: [{
		provide: APP_GUARD,
		useClass: AuthGuard
	}]
})
export class AdminModule {}
