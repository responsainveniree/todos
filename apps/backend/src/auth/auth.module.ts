import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
