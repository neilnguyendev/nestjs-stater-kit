import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UsersService } from '../users/users.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserDto } from '../users/dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ApiConfigService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: UserDto,
    description: 'Register user',
  })
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<UserDto> {
    return await this.authService.register(userRegisterDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async login(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    return await this.authService.checkLogin(userLoginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<LoginPayloadDto> {
    return await this.authService.verifyRefreshToken(
      refreshTokenDto.refreshToken
    );
  }
}
