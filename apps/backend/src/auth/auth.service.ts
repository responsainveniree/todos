import { Injectable } from '@nestjs/common';
import { EmailCredentialsSchema as EmailCredentialsDto } from '@todos/shared';
import { auth } from '../lib/auth.js';

@Injectable()
export class AuthService {
  signInEmail(emailCredentials: EmailCredentialsDto) {
    return auth.api.signInEmail({
      body: {
        email: emailCredentials.email,
        password: emailCredentials.password,
      },
      asResponse: true,
    });
  }
}
