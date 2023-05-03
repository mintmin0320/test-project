import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { UsersRepository } from './../users.repository';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { UserInfo } from '../UserInfo';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users.schema';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';


@Injectable() // 이 데코 때문에 프로바이더가 되어 다른 컴포넌트에서 주입 가능
export class UsersService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string

  constructor(
    private emailService: EmailService,
    private readonly usersRepository: UsersRepository,
  ) {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY, // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
    });
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME; // nest-s3
  }

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

  async findUser(userId: string): Promise<UserInfo> {
    const result = await this.usersRepository.userData(userId);

    return result;
  }

  async findAll(): Promise<UserInfo[]> {
    const result = await this.usersRepository.allUserData();

    return result;
  }

  async uploadFileToS3(folder: string, file: Express.Multer.File,): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
  }> {
    //함수시작
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
      return { key, s3Object, contentType: file.mimetype };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.usersRepository.deleteUser(userId);

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



}
