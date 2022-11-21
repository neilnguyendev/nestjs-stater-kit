import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UsersService } from '../users/users.service';
import { RoleType, TokenType } from '../../constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ApiConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.jwtKey,
    });
  }

  async validate(args: {
    userId: number;
    role: RoleType;
    type: TokenType;
  }): Promise<User> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(args.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
