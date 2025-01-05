import { UseGuards, applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserAuthGuard } from "../guards/user-auth.guard";

export function UserAuth() {
  return applyDecorators(
    UseGuards(UserAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "user not authorized" }),
    ApiForbiddenResponse()
  );
}
