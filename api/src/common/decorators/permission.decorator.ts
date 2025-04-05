import { SetMetadata } from '@nestjs/common';

export const RequirePermission = (permission: string| string[]) =>
  SetMetadata('permission', permission);