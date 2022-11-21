import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { RoleType, TokenType } from '../../constants';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { MailService } from '../mail/mail.service';
import { RESPONSE_MESSAGE } from '../../constants/response-message';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserDto } from '../users/dto/user.dto';
import { validateHash } from '../../common/utils';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private usersService: UsersService,
    private mailService: MailService
  ) {}

  private async createAccessToken(data: {
    role: RoleType;
    userId: number;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
      accessTokenExpiresIn: this.configService.authConfig.accessExpirationTime,
      refreshToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.REFRESH_TOKEN,
          role: data.role,
        },
        {
          expiresIn: this.configService.authConfig.refreshExpirationTime,
        }
      ),
      refreshTokenExpiresIn:
        this.configService.authConfig.refreshExpirationTime,
    });
  }

  private async generateLoginPayload(
    userEntity: User
  ): Promise<LoginPayloadDto> {
    const token = await this.createAccessToken({
      userId: userEntity.id,
      role: RoleType.USER, // TODO: Update later when there are more than one role
    });

    return new LoginPayloadDto(
      await this.usersService.getUserDto(userEntity),
      token
    );
  }

  async register(userRegisterDto: UserRegisterDto): Promise<UserDto> {
    const email = userRegisterDto.email;
    const user = await this.usersService.findByEmail(email);

    // If user does not exist, create user in db
    if (!user) {
      const newUser = await this.usersService.create(userRegisterDto);

      // Send a welcome email
      // await this.mailService.sendWelcomeEmail(email);

      return this.usersService.getUserDto(newUser);
    } else {
      throw new BadRequestException(RESPONSE_MESSAGE.auth.emailExisted);
    }
  }

  async checkLogin(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.usersService.findByEmail(userLoginDto.email);

    if (userEntity) {
      if (await validateHash(userLoginDto.password, userEntity.password)) {
        return await this.generateLoginPayload(userEntity);
      } else {
        throw new BadRequestException(RESPONSE_MESSAGE.auth.passwordIncorrect);
      }
    } else {
      throw new BadRequestException(RESPONSE_MESSAGE.auth.userNotFound);
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const decodedData = await this.jwtService.verifyAsync(refreshToken);
      const userEntity = await this.usersService.findOne(decodedData.userId);

      if (userEntity) {
        return await this.generateLoginPayload(userEntity);
      } else {
        throw new BadRequestException(RESPONSE_MESSAGE.auth.userNotFound);
      }
    } catch (e) {
      throw new BadRequestException(
        RESPONSE_MESSAGE.auth.tokenInvalidOrExpired
      );
    }
  }
}
