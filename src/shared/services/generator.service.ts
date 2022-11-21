import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import snowflake from 'snowflake-id';

@Injectable()
export class GeneratorService {
  private snowflakeId: snowflake = ((_machineId = 1) => {
    return new snowflake({
      mid: _machineId,
      offset: (2021 - 1970) * 31536000 * 1000,
    });
  })();

  public generateSnowflakeId(): number {
    return this.snowflakeId.generate();
  }

  public uuid(): string {
    return uuid();
  }

  public fileName(ext: string): string {
    return this.uuid() + '.' + ext;
  }
}
