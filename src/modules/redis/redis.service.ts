import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    expiryInSeconds: number = 10,
  ): Promise<T> {
    const cachedValue = await this.redis.get(key);
    if (cachedValue) {
      return JSON.parse(cachedValue);
    }

    const value = await fetchFunction();
    await this.redis.set(key, JSON.stringify(value), 'EX', expiryInSeconds);
    return value;
  }

  public async clearAll() {
    await this.redis.flushall();
  }
}
