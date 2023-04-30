import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './services/users.service';
import { EmailModule } from 'src/email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './users.schema';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema }, // 어떤 colloect을 사용할지 지정
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository, UsersRepository],
})
export class UsersModule { }
