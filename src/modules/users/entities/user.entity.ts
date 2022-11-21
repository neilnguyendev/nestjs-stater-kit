import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserDto } from '../dto/user.dto';
import { UseDto } from '../../../decorators';

@Entity('users')
@UseDto(UserDto)
export class User extends AbstractEntity<UserDto> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
