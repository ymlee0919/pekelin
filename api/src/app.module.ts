import { Module } from '@nestjs/common';
import { AdminModule } from './api/admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static'; 
import { join } from 'path';
import { RouterModule } from '@nestjs/core';
import { ClientAppModule } from './api/client/app/application.module';

@Module({
imports: [
	AdminModule, 
	ClientAppModule,
	
	RouterModule.register([
		{ path: 'api', module: AdminModule },
		{ path: 'client', module: ClientAppModule },
	
	]),
	ServeStaticModule.forRoot({
		rootPath: join(__dirname, '../', 'public')
	})
]
})

export class AppModule {}
