import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { LicenseModule } from './modules/license/license.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    UsersModule,
    ClientsModule,
    ProductsModule,
    SalesModule,
    LicenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
