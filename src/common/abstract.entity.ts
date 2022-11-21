import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import type { Constructor } from '../types';
import type { AbstractDto } from './dto/abstract.dto';

/**
 * Abstract Entity
 *
 * @description This class is an abstract class for all entities.
 * It's experimental and recommended using it only in microservice architecture,
 * otherwise just delete and use your own entity.
 */

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never
> {
  @PrimaryColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  private dtoClass: Constructor<DTO, [AbstractEntity, O?]>;

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`
      );
    }

    return new this.dtoClass(this, options);
  }
}
