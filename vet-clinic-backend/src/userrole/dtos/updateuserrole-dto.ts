import { PartialType } from "@nestjs/mapped-types";
import { CreateUserRoleDto } from "./createuserrole-dto";


export class UpdateUserRoleDto extends PartialType (CreateUserRoleDto) {}