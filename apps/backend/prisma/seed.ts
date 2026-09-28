import { seedAccounts } from './seeders/account.seeder.js';

async function main() {
  await seedAccounts();

  console.log('Seeding is completed successfully');
}

main();
