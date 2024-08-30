import { DocumentoService } from './services/documento.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'oracle',  // Especifica el tipo literal "oracle"
        connectString: configService.get<string>('DB_CONNECT_STRING'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE') === true,
        logging: configService.get<boolean>('DB_LOGGING') === true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DocumentoService],
})
export class AppModule {}