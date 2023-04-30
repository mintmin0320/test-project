import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { UsersRepository } from './../users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { UserInfo } from '../UserInfo';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable() // 이 데코 때문에 프로바이더가 되어 다른 컴포넌트에서 주입 가능
export class UsersService {
  constructor(
    private emailService: EmailService,
    private readonly usersRepository: UsersRepository,
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const isEmailExist = await this.usersRepository.existByEmail(email)
    if (isEmailExist) {
      throw new UnauthorizedException('해당 이일메일은 이미 존재합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return { result: true, message: "회원가입 성공!" };
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    const { email, password } = userLoginDto;

    throw new Error('Method not implemented.');
  }

  async findAll() {
    const result = await this.usersRepository.allUserData();

    return result;
  }

  private saveUser(name: string, email: string, passowrd: string, signupVerifyToken: string) {
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급

    throw new Error('Method not implemented.');
  }



  async getUserInfo(userId: string): Promise<UserInfo> {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답

    throw new Error('Method not implemented.');
  }
}
