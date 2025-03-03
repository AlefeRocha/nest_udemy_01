import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
        @IsString()
        @IsNotEmpty()
        readonly name: string

        @IsString()
        @IsNotEmpty()
        readonly email: string;
    
        @IsString()
        @IsNotEmpty()
        @MinLength(5)
        readonly password: string;

        readonly updatedAt: string;
}
