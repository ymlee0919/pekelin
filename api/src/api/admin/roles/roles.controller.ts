import { Controller, Get, Post, Patch, Delete, Param, Body, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { CustomParseIntPipe } from 'src/services/pipes/customParseInt.pipe';
import { Module, Role } from './roles.types';
import { InvalidOperationError } from 'src/api/common/errors/invalid.error';

@Controller('api/roles')
export class RolesController {
    constructor(private readonly manager: RolesService) {}

    @Get('/permissions')
    async listPermissions() : Promise<Array<Module>> {
        return this.manager.getPermissions();
    }

    @Get()
    async listRoles() : Promise<Array<Role>> {
        return this.manager.getRoles();
    }

    @Get('/:roleId')
    async get(@Param('roleId', CustomParseIntPipe) roleId: number) : Promise<Role> {
        try {
            let role = await this.manager.get(roleId);
            return role;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Post()
    async addRole(@Body() createRoleDto: CreateRoleDto) : Promise<Role> {
        try {
            let createdRole = await this.manager.createRole(createRoleDto);
            return createdRole;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Patch('/:roleId')
    async updateRole(
        @Param('roleId', CustomParseIntPipe) roleId: number,
        @Body() updateRoleDto: UpdateRoleDto
    ): Promise<Role> {
        try {
            let updatedRol = this.manager.updateRole(roleId, updateRoleDto);
            return updatedRol;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Delete('/:roleId')
    async deleteRole(@Param('roleId', CustomParseIntPipe) roleId: number,) {
        try {
            let deletedRol = this.manager.deleteRole(roleId);
            return deletedRol;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }
}