import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as fs from 'fs';
import * as path from 'path';
@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('TypeOrmModule');
        const certPath = path.join(__dirname, '..', 'certs', 'ca.pem');
        logger.log(`Attempting to read CA certificate from: ${certPath}`);
        let caCert;
        try {
          caCert = fs.readFileSync(certPath).toString();
          logger.log('Successfully read CA certificate file.');
        } catch (error) {
          logger.error('!!! FAILED TO READ CA CERTIFICATE FILE !!!');
          logger.error(error);
          throw new Error('Could not read the ca.pem file. Check the path and file permissions.');
        }
        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          ssl: {
            rejectUnauthorized: true,
            ca: caCert,
          },
          autoLoadEntities: true, 
          synchronize: true, 
        };
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
