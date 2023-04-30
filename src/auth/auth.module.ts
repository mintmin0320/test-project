import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // 환경변수 사용을 위해
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), //나중에 생성될 strategy 파일 설정 가능, 세션 사용 안 하니 false로
    JwtModule.register({      //로그인시사용 , jwt를 만들어주고 사인해줌
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => UsersModule), // 순환참조 관계로
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
