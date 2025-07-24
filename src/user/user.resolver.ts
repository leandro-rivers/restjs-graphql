import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './dto';

@Resolver(() => User)
export class UserResolver {

    constructor(private readonly userService: UserService) {}

    @Query(() => [User], { name: 'users' })
    async findAll() {
        return await this.userService.findAll();
    }

    @Query(() => User)
    async getUser(@Args('id', { type: () => Int }) id: number) {
        return await this.userService.findOne(id);
    }

    @Mutation(() => User)
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return await this.userService.create(createUserInput);
    }

    @Mutation(() => User)
    async updateUser(
        @Args('id', { type: () => Int }) id: number, 
        @Args('updateUserInput') updateUserInput: UpdateUserInput
    ) {
        return await this.userService.update(id, updateUserInput);
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id', { type: () => Int }) id: number) {
        const result = await this.userService.delete(id);
        return result.affected === 1;
    }
}
