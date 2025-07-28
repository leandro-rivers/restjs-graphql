import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from 'src/user/dto';
import { Repository } from 'typeorm';
import { hash, verify } from 'argon2';
import { Role } from 'src/enums/role.enum';
import { SignInInput } from './dto/signIn.input';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { AuthPayload } from './entities/auth-payload';
import { JwtUser } from './types/jwt-user';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>, 
        private readonly jwtService: JwtService
    ) {}

    async registerUser(input: CreateUserInput) {
        const hashedPassword = await hash(input.password);
        const user = this.userRepo.create({
            ...input,
            password: hashedPassword,
            role: Role.USER,
        });
        const savedUser = await this.userRepo.save(user);
        console.log('Saved user with ID:', savedUser.id);
        return savedUser;
    }

    async validateLocalUser({email, password}: SignInInput) {
        const user = await this.userRepo.findOneByOrFail({ email });
        const isPasswordValid = await verify(user.password, password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async generateToken(userId: number){
        const payload: AuthJwtPayload = {
            sub: {
                userId,
            },
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };
    }

    async login(user: User): Promise<AuthPayload> {
        const { accessToken } = await this.generateToken(user.id);

        return {
            userId: user.id,
            role: user.role,
            accessToken,
        }
    }

    async validateJwtUser(userId: number): Promise<JwtUser> {
        const user = await this.userRepo.findOneByOrFail({ id: userId });
        const jwtUser: JwtUser = {
            userId: user.id,
            role: user.role,
        };
        return jwtUser;
    }
}
