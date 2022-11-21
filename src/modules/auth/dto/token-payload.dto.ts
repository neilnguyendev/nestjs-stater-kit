import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpiresIn: number;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshTokenExpiresIn: number;

  constructor(data: {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  }) {
    this.accessToken = data.accessToken;
    this.accessTokenExpiresIn = data.accessTokenExpiresIn;
    this.refreshToken = data.refreshToken;
    this.refreshTokenExpiresIn = data.refreshTokenExpiresIn;
  }
}
