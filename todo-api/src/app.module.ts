import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TodosModule } from './todos/todos.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
  type: "postgres",
  host: "127.0.0.1",
  port: 5433,
  username: "postgres",
  password: "postgres",
  database: "todo",
  autoLoadEntities: true,
  synchronize: false,
  }), TodosModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
