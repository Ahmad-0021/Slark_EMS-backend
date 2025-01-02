import { RoleSeederService } from './roleSeed';
import { Command, Console } from 'nestjs-console';

@Console()
export class SeedCommand {
  constructor(private readonly roleSeeder: RoleSeederService) {}

  @Command({
    command: 'seed:role',
    description: 'Seed roles into the database',
  })
  async seedPermissions() {
    await this.roleSeeder.seedRoles();
  }
}
