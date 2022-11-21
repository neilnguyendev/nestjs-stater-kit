import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '../../decorators';
import { RoleType } from '../../constants';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  async getCurrentUser(@AuthUser() user: User): Promise<UserDto> {
    return await this.usersService.getUserDto(user);
  }
}
