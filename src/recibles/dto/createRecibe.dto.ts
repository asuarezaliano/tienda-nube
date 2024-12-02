import { IsEnum, IsNumber, IsString } from 'class-validator';
import {
  RecibleStatusType,
  RecibleStatusTypeList,
} from 'src/transaction/enum/transaction-type.enum';

export class CreateRecibleDto {
  @IsEnum(RecibleStatusType, {
    message: `Valid status are ${RecibleStatusTypeList}`,
  })
  status: string;

  @IsString()
  create_date: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false })
  subtotal: number;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false })
  discount: number;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false })
  total: number;

  @IsString()
  transactionId: string;

  @IsString()
  merchantId: string;
}
