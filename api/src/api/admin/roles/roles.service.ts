import { Injectable } from '@nestjs/common';
import { DatabaseService } from "src/services/database/database.service";
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { InvalidOperationError } from 'src/api/common/errors/invalid.error';
import { Module, Role } from './roles.types';


@Injectable()
export class RolesService {
    constructor(private readonly database: DatabaseService) {}

    // List all roles
    async getRoles(): Promise<Array<Role>> {
        return this.database.roles.findMany({
            include: {
                modules: true, // Include permissions if needed in the response
            },
        });
    }

    async get(roleId: number) : Promise<Role> {
        let role = await this.database.roles.findUnique({
            where: {roleId},
            include: {
                modules: true
            }
        });

        if(!role)
            throw new InvalidOperationError("Role not found");

        return role;
    }

    async validatePermissionIds(permissionIds: number[]) : Promise<void> {
        const existingPermissions = await this.database.systemModule.findMany({
            where: {
                moduleId: { in: permissionIds },
            },
        });
    
        // Check if any IDs don't exist
        if (existingPermissions.length !== permissionIds.length) {
            throw new InvalidOperationError('One or more modules are invalid.');
        }
    }
    

    // List all permissions
    async getPermissions() : Promise<Array<Module>> {
        return this.database.systemModule.findMany();
    }

    // Create a role using DTO
    async createRole(createRoleDto: CreateRoleDto) : Promise<Role> {
        const { name , details, permissionIds } = createRoleDto;

        // Validate unique role name
        const existingRole = await this.database.roles.findFirst({
            where: {
                role: name
            }
        });

        if (existingRole) {
            throw new InvalidOperationError('Role name already exists.');
        }

        // Validate permission IDs
        await this.validatePermissionIds(permissionIds);

        // Create the role and associate permissions
        const role = await this.database.roles.create({
            data: {
                role: name,
                details,
                modules: {
                    connect: permissionIds.map((moduleId) => ({ moduleId})),
                },
            },
        });

        return role;
    }

    // Update a role using DTO
    async updateRole(roleId: number, updateRoleDto: UpdateRoleDto) : Promise<Role> {
        const { name, details, permissionIds } = updateRoleDto;

        // Validate permission IDs if provided
        if (permissionIds && permissionIds.length > 0) {
            await this.validatePermissionIds(permissionIds);
        }
  
        // Update the role and permissions
        const role = await this.database.roles.update({
            where: { roleId },
            data: {
                    role: name,
                    details,
                    modules: permissionIds ? {
                        set: permissionIds.map((moduleId) => ({ moduleId })),
                    } : undefined,
            },
        });

        return role;
    }

    // Delete a role
    async deleteRole(roleId: number) : Promise<Role> {
        // Validate if the role is assigned to users
        const isAssigned = await this.isRoleAssigned(roleId);
        if (isAssigned) {
            throw new InvalidOperationError('Role is assigned to users and cannot be deleted.');
        }

        // Delete the role
        return this.database.roles.delete({
            where: { roleId: roleId },
        });
    }

    // Check if the role is assigned to any user
    async isRoleAssigned(roleId: number): Promise<boolean> {
        const userCount = await this.database.accounts.count({
            where: { roleId },
        });
        return userCount > 0;
    }
}