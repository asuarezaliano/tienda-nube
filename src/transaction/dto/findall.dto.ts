import { IsString } from 'class-validator';

export class findAllDto {
  @IsString()
  merchantId: string;
}
