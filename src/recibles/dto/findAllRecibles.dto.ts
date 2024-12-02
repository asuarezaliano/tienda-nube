import { IsString } from 'class-validator';

export class findAllReciblesDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  merchantId: string;
}
