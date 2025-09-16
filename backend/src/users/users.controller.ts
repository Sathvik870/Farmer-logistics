import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Patch(':id/authorize')
    authorize(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.authorize(id);
    }
}