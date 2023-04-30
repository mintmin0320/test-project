import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { UserInfo } from '../UserInfo';
import { UsersService } from '../services/users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('users')
@ApiTags('user api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ summary: '회원가입', description: 'user 생성 API' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 500, description: 'Server Error !!' })
  @ApiResponse({ status: 404, description: 'Client Error !!' })

  @Post('/sign-up')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @ApiOperation({ summary: '로그인', description: 'user 로그인 API' })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @Post('/sign-in')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.jwtSignIn(userLoginDto);
  }

  @ApiOperation({ summary: '특정 유저 조회', description: 'user 정보조회 API' })
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    return await this.usersService.getUserInfo(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '모든 유저 조회', description: '모든 user 정보조회 API' })
  @Get()
  async getAllUser() {
    return await this.usersService.findAll();
  }
}

