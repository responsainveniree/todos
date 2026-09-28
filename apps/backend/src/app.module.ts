import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { TodosModule } from './todos/todos.module.js';
import { auth } from './lib/auth.js';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { AuthModule as AuthModuleApi } from './auth/auth.module.js';
import * as path from 'path';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), '../../packages/.env'), // Coba ambil dari root monorepo
        path.resolve(process.cwd(), '../.env'), // Jika tidak ada, pakai .env lokal di backend
      ],
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: process.env.OBSERVE_APP_KEY ?? '',
    //   appSecret: process.env.OBSERVE_APP_SECRET ?? '',
    //   runtimeMetrics: !Boolean(process.versions?.['webcontainer']),
    //   serviceId: 'nest-typescript-starter',
    // }),
    AuthModule.forRoot({ auth }),
    TodosModule,
    UsersModule,
    AuthModuleApi,
  ],
})
export class AppModule {}
