import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findAll(): Promise<Omit<User, 'password'>[]> {
        return this.usersRepository.find({
            select: ['id', 'username', 'email', 'phoneNumber', 'role', 'authorized', 'createdAt']
        });
    }

    async authorize(id: number): Promise<{ message: string }> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found.`);
        }
        user.authorized = true;
        await this.usersRepository.save(user);
        return { message: `User ${user.username} has been successfully authorized.` };
    }
}