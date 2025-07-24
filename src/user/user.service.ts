import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    
    async findAll(): Promise<User[]> {
        return await this.userRepository.find({});
    }
    
    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneOrFail({ where: { id } });
    }
    
    async create(createUserInput: CreateUserInput): Promise<User> {
        const user = this.userRepository.create(createUserInput);
        return await this.userRepository.save(user);
    }

    async update(id: number, updateUserInput: UpdateUserInput) {
        const user = await this.userRepository.findOneOrFail({ where: { id } });
        return await this.userRepository.save(new User(Object.assign(user, updateUserInput)));
    }
   
    async delete(id: number) {
        return await this.userRepository.delete(id);
    }
}
