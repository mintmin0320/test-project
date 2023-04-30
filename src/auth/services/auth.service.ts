import { UsersRepository } from 'src/users/users.repository';
import { UserLoginDto } from '../dto/user-login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService, //auth 모듈에 JwtModule에서 사용
  ) { }

  async jwtSignIn(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;

    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('잘못된 이메일입니다.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('잘못된 비밀번호입니다.');
    }

    const payload = { email: email, sub: user.id } //sub는 토큰 제목

    return { result: true, message: '로그인 성공', token: this.jwtService.sign(payload) } //sign 함수로 토큰에 넣는다
  }
}
