import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { GeneratorService } from '../../shared/services/generator.service';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private generatorService: GeneratorService
  ) {}

  async create(userRegisterDto: UserRegisterDto): Promise<User> {
    let user;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Save user to db
      user = await queryRunner.manager.save(
        this.usersRepository.create({
          id: this.generatorService.generateSnowflakeId(),
          ...userRegisterDto,
        })
      );

      await queryRunner.commitTransaction();

      // fetch user data from db
      user = this.findOne(user.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return user;
  }

  async getUserDto(user: User): Promise<UserDto> {
    return user.toDto();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
