import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsNotEmpty()
  @IsBoolean()
  readonly read: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  readonly text: string;

  readonly updatedAt: Date;
}
