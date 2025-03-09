import { Module } from '@nestjs/common';
import { AdminModule } from './api/admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static'; 
import { join } from 'path';
import { RouterModule } from '@nestjs/core';
import { ClientModule } from './api/client/client.module';


@Module({
imports: [
	AdminModule, 
	ClientModule,
	
	RouterModule.register([
		{ path: 'api', module: AdminModule },
		{ path: 'client', module: ClientModule },
	
	]),
	ServeStaticModule.forRoot({
		rootPath: join(__dirname, '../', 'public')
	})
]
})

export class AppModule {}
