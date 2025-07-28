import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "./create-user.input";
import { Role } from "src/enums/role.enum";
import { IsEnum } from "class-validator";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @IsEnum(Role)
    @Field(() => Role)
    role: Role;
}