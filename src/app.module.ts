import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';

// TODO: import your feature modules here
import { CustomerModule } from './customer/customer.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { WorkshopModule } from './workshop/workshop.module';
import { MechanicModule } from './mechanic/mechanic.module';
import { ServiceModule } from './service/service.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AdminModule } from './admin/admin.module';
import { MechanicReviewModule } from './mechanic-review/mechanic-review.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Env vars
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM (MySQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // en dev; en prod usar migrations
        retryAttempts: 3,
        retryDelay: 2000,
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 10),
          },
        ],
      }),
    }),

    // Feature modules
    CustomerModule,

    VehicleModule,

    WorkshopModule,

    MechanicModule,

    ServiceModule,

    AppointmentModule,

    AdminModule,

    MechanicReviewModule,

    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
