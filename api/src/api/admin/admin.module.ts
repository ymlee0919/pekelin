import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';

import { DatabaseModule } from 'src/services/database/database.module';

import { AccountsModule } from './accounts/accounts.module';
import { ProductsModule } from './products/products.module';
import { ApplicationModule } from './app/application.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { VariantsModule } from './variants/variants.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CsrfGuard } from 'src/services/guard/csrf.guard';
import { RolesModule } from './roles/roles.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';

@Module({
	imports: [
		DatabaseModule, 
		AccountsModule, 
		AuthModule,
		ApplicationModule,
		ProductsModule,
		VariantsModule,
		CategoriesModule,
		ReviewsModule,
		RolesModule,
		ClientsModule,
		OrdersModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '8h' },
		}),
		// Configure the ThrottlerModule
		ThrottlerModule.forRoot({
			throttlers: [{
				ttl: 60, // Time-to-live in seconds (1 minute)
				limit: 10, // Maximum number of requests within the TTL
			}]
		})
	],
	providers: [{
		provide: APP_GUARD,
		useClass: AuthGuard
	},{
		provide: APP_GUARD,
		useClass: CsrfGuard
	}]
})
export class AdminModule {}
