import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PermissionSeederService } from './modules/permission/seed/permission.seeder';
import { RoleSeederService } from './modules/role/seed/roleSeed';
import { UserSeederService } from './modules/user/seed/userSeed';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const args = process.argv.slice(2);

  try {
    const permissionSeeder = app.get(PermissionSeederService);
    const roleSeeder = app.get(RoleSeederService);
    const userSeeder = app.get(UserSeederService);

    if (args.includes('permissions')) {
      console.log('Starting permission seeding...');
      await permissionSeeder.seedPermissions();
      console.log('Permissions seeded successfully.');
      return; // Exit after successful permission seeding
    }

    if (args.includes('roles')) {
      console.log('Starting role seeding...');
      await roleSeeder.seedRoles();
      console.log('Roles seeded successfully.');
      return; // Exit after successful role seeding
    }
    if (args.includes('users')) {
      console.log('Starting role seeding...');
      await permissionSeeder.seedPermissions();
      console.log('permission seeded successfully.');
      await roleSeeder.seedRoles();
      console.log('roles seeded successfully.');
      await userSeeder.seedUsers();
      console.log('users seeded successfully.');
      return; // Exit after successful role seeding
    }

    // if (!args.includes('permissions') && !args.includes('roles')) {
    //   console.log('Starting permission and role seeding...');

    //   console.log('Seeding permissions...');
    //   await permissionSeeder.seedPermissions();
    //   console.log('Permissions seeded successfully.');

    //   console.log('Seeding roles...');
    //   await roleSeeder.seedRoles();
    //   console.log('Roles seeded successfully.');
    // }
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1); // Exit with an error code to stop further execution
  } finally {
    await app.close();
    console.log('Application context closed.');
  }
}

seed();
