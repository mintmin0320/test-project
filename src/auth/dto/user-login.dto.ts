import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({
    example: 'mintmin0320@gmail.com',
    description: 'email',
    required: true,
  })
  email: string;
  @ApiProperty({
    example: 'qwer1234',
    description: 'password',
    required: true,
  })
  password: string;
}