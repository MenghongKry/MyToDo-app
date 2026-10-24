import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../jwt.strategy.js';

// @CurrentUser() user → the { id, role } that JwtStrategy.validate put on req.user.
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  return ctx.switchToHttp().getRequest().user;
});
