import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../users.schema';

export class ReadOnlyUserDto extends PickType(User, ['email', 'name'] as const) {
  // pickType : 필요한것만 가져옴
  @ApiProperty({  //swagger에서 데이터 입력 예시 형태를 제공
    example: '4ecc05e55dd98a436ddcc47',
    description: '_id',
  })
  id: string;
}