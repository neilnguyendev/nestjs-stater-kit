import { ApiProperty } from '@nestjs/swagger';

import { TokenPayloadDto } from './token-payload.dto';
import { UserDto } from '../../users/dto/user.dto';

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: UserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
