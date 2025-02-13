import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsNotEmpty()
  @IsBoolean()
  readonly read: boolean;
  readonly update: Date;
}
