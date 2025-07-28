import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './dto';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt-guard/gql-jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Resolver(() => User)
export class UserResolver {

    constructor(private readonly userService: UserService) {}

    @Query(() => [User], { name: 'users' })
    async findAll() {
        return await this.userService.findAll();
    }

    @UseGuards(GqlJwtGuard)
    @Query(() => User)
    async getUser(@Args('id', { type: () => Int }) id: number) {
        return await this.userService.findOne(id);
    }

    @Roles(Role.ADMIN)
    @UseGuards(GqlJwtGuard, RolesGuard)
    @Mutation(() => User)
    async updateUser(
        @CurrentUser() user: JwtUser,
        @Args('updateUserInput') updateUserInput: UpdateUserInput
    ) {
        return await this.userService.update(user.userId, updateUserInput);
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id', { type: () => Int }) id: number) {
        const result = await this.userService.delete(id);
        return result.affected === 1;
    }
}
