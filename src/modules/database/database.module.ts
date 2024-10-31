import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle.module';
import { DatabaseService } from './database.service';

@Module({
  imports: [DrizzleModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
