import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";

@InputType()
export class SignInInput {
    @Field()    
    @IsEmail()
    @IsString()
    email: string;

    @Field()
    @IsString()
    @MinLength(3)
    password: string;
}