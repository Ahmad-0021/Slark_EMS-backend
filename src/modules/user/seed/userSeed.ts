import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/modules/role/entities/role.schema';
import { User } from '../entities/user.schema';

import { IUserDoc } from 'src/common/interfaces';
import { users } from './data';
import { hashPassword } from 'src/modules/auth/utils/hashedPassword';

@Injectable()
export class UserSeederService {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>, // Role model
    @InjectModel(User.name) private readonly userModel: Model<IUserDoc>, // User model
  ) {}

  async seedUsers(): Promise<void> {
    try {
      this.logger.log('Checking for existing roles...');
      const roles = await this.roleModel.find().exec();

      if (roles.length === 0) {
        this.logger.error('No roles found. Please seed roles first.');
        return;
      }

      const roleMap = roles.reduce(
        (map, role) => {
          map[role.name] = role._id;
          return map;
        },
        {} as { [key: string]: any },
      );

      this.logger.log('Seeding users...');
      await Promise.all(
        users.map(async (user) => {
          if (!roleMap[user.role]) {
            this.logger.warn(
              `Role "${user.role}" does not exist for user "${user.email}".`,
            );
            return;
          }

          const hashedPassword = await hashPassword(user.password);
          await this.userModel.findOneAndUpdate(
            { email: user.email },
            {
              ...user,
              password: hashedPassword,
              role: roleMap[user.role],
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );

          this.logger.log(`User "${user.email}" seeded successfully.`);
        }),
      );

      this.logger.log('All users seeded successfully.');
    } catch (error) {
      this.logger.error('Error during user seeding:', error.message);
      throw error;
    }
  }
}
