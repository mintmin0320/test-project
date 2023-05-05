import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'mintmin',
    description: 'name',
    required: true,
  })
  @Transform(params => params.value.trim()) // 이름 앞뒤 공백 제거
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @ApiProperty({
    example: 'mintmin0320@gmail.com',
    description: 'email',
    required: true,
  })
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @ApiProperty({
    example: 'qwer1234',
    description: 'password',
    required: true,
  })
  @IsString()
  // @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/) // 영문 대소문자 특수문자로 이뤄진
  readonly password: string;
}