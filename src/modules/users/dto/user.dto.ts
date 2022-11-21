import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { User } from '../entities/user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty()
  email: string;

  constructor(user: User) {
    super(user);
    this.email = user.email;
  }
}
