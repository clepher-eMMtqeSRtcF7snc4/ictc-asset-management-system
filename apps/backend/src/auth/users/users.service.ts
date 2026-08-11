import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { schema } from '../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { eq } from 'drizzle-orm';
import { user } from '../schema';
import { UpdateProfileInput, UserProfile } from '@repo/trpc/schemas';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  private profileSelect(currentUserId: string) {
    return {
      id: user.id,
      name: user.name,
      image: user.image,
    };
  }

  async findById(userId: string) {
    const foundUser = await this.database.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async getUserProfile(
    userId: string,
    currentUserId: string,
  ): Promise<UserProfile> {
    const result = await this.database
      .select(this.profileSelect(currentUserId))
      .from(user)
      .where(eq(user.id, userId));

    return result[0] || null;
  }

  async updateProfile(userId: string, updates: UpdateProfileInput) {
    await this.database.update(user).set(updates).where(eq(user.id, userId));
  }
}
