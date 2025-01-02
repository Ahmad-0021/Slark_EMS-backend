import { UserSeederService } from './userSeed';
import { Command, Console } from 'nestjs-console';

@Console()
export class UserSeedCommand {
  constructor(private readonly userSeederService: UserSeederService) {}

  @Command({
    command: 'seed:users',
    description: 'Seed users into the database',
  })
  async seedUsers() {
    try {
      await this.userSeederService.seedUsers();
    } catch (error) {
      console.error('Error during user seeding:', error.message);
    }
  }
}
