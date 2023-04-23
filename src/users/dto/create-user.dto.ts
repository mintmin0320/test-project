import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @Transform(params => params.value.trim()) // 이름 앞뒤 공백 제거
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/) // 영문 대소문자 특수문자로 이뤄진
  readonly password: string;
}