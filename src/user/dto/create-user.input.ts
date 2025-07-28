import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/enums/role.enum";

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    password: string;
}