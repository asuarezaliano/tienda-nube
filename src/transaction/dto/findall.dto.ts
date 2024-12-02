import { IsString } from 'class-validator';

export class findAllDto {
  @IsString()
  name: string;
}
