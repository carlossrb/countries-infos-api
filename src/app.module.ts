import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as redisStore from 'cache-manager-redis-store';

import { GlobalExceptionFilter } from '@core/exception/exception.filter';

import { PlaceModule } from './modules/places/infra/nest/place.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      cache: true,
      isGlobal: true,
    }),
    PlaceModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => ({
        namingStrategy: new SnakeNamingStrategy(),
        type: 'postgres',
        host: conf.get('DATABASE_HOST'),
        port: conf.get<number>('DATABASE_PORT'),
        username: conf.get('DATABASE_USER'),
        password: conf.get('DATABASE_PASSWORD'),
        database: conf.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: conf.get('NODE_ENV') !== 'production',
        supportBigNumbers: true,
        bigNumberStrings: false,
        dropSchema: true,
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => ({
        store: conf.get('CACHE_ENABLED') === 'true' ? redisStore : 'memory',
        host: conf.get('CACHE_HOST'),
        port: conf.get<number>('CACHE_PORT'),
      }),
    }),
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
