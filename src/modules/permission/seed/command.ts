import { PermissionSeederService } from './permission.seeder';
import { Command, Console } from 'nestjs-console';

@Console()
export class SeedCommand {
  constructor(private readonly permissionSeeder: PermissionSeederService) {}

  @Command({
    command: 'seed:permissions',
    description: 'Seed permissions into the database',
  })
  async seedPermissions() {
    await this.permissionSeeder.seedPermissions();
  }
}
