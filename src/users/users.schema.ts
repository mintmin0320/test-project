import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true, // DB에서 하나가 만들어지면 타임스탬프가 찍힌다.
  versionKey: false,
}

@Schema(options) //스키마 정의
export class User extends Document {  // 몽구스 도큐먼트를 상속받음
  @ApiProperty({
    example: 'mintmin0320@gmail.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'mintmin',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({ //디폴트 이미지 설정하기 회원가입 시 이미지를 업로드 안 하니까
    default:
      'https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg'
  })
  @IsString()
  imgUrl: string;

  readonly readOnlyData: {
    id: string,
    email: string,
    name: string,
  };
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});

// _CatSchema.virtual('comments', {
//   ref: 'comments', //comments 스키마와 연결
//   localField: '_id',
//   foreignField: 'info', //외레필드
// });
// _CatSchema.set('toObject', { virtuals: true }); //populate 옵션을 사용하기 위한 두 가지 옵션
// _CatSchema.set('toJSON', { virtuals: true });
