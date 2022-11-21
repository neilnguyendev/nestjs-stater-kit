import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';
import { User } from '../entities/user.entity';
import { generateHash } from '../../../common/utils';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): typeof User {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<User>): void {
    // FIXME check event.databaseEntity.password
    const entity = event.entity as User;

    if (entity.password && entity.password !== event.databaseEntity.password) {
      entity.password = generateHash(entity.password!);
    }
  }
}
