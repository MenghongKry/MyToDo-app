import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/entities/role.enum.js';

export const ROLES_KEY = 'roles';
// @Roles(Role.ADMIN) → only users with one of these roles can call the route.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
