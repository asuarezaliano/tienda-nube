import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class findAllReciblesDto {
  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;

  @IsString()
  merchantName: string;
}
