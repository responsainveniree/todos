import { Role } from '../../src/generated/prisma/enums.js';
import { auth } from '../../src/lib/auth.js';

export async function seedAccounts() {
  await auth.api.signUpEmail({
    body: {
      name: 'Project Manager',
      email: 'pm@example.com',
      password: 'password',
      role: 'PROJECT_MANAGER' as Role,
    },
  });

  await auth.api.signUpEmail({
    body: {
      name: 'Programmer',
      email: 'p@example.com',
      password: 'password',
      role: 'PROGRAMMER' as Role,
    },
  });
}
