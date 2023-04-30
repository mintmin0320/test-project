import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {//인증을 할때사용함
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에 토큰으로 부터 추출
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false, // 만료기간 지정하는걸 무시할건지 => 무시 안 할 거니까 false로
    })
  }
  async validate(payload: Payload) { //인증 가드가 실행되면 이 부분 실행
    const user = await this.usersRepository.findCatByIdWithoutPassword(
      payload.sub,
    );

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('접근 오류')
    }
  }
}