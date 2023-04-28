import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserInfo } from '../UserInfo';
import { UsersService } from '../services/users.service';
import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadOnlyUserDto } from '../dto/user.dto.';

@Controller('users')
@ApiTags('user api')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiOperation({ summary: '회원가입', description: 'user 생성 API' })
  // @ApiCreatedResponse({ description: '유저를 생성한다.', type: User })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error...',
  // })
  // @ApiResponse({ status: 500, description: 'Server Error' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 500, description: 'Server Eroor...' })
  @ApiResponse({ status: 404, description: 'Client Eroor...' })

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @ApiOperation({ summary: '로그인', description: 'user 로그인 API' })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return this.usersService.login(email, password);
  }

  @ApiOperation({ summary: '조회', description: 'user 정보조회 API' })
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    return await this.usersService.getUserInfo(userId);
  }
}

