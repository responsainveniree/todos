import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../utils/zod-validation-pipe.js';
import {
  emailCredentialsSchema,
  type EmailCredentialsSchema as EmailCredentialsDto,
} from '@todos/shared';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(emailCredentialsSchema))
  signInEmail(@Body() credentials: EmailCredentialsDto) {
    return this.authService.signInEmail(credentials);
  }
}
