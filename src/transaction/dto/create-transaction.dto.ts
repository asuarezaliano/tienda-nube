import {
  IsDate,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  TransactionType,
  TransactionTypeList,
} from '../enum/transaction-type.enum';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  totalAmount: string;

  @IsString()
  description: string;

  @IsEnum(TransactionType, {
    message: `Valid status are ${TransactionTypeList}`,
  })
  paymentMethod;

  @IsNumber()
  @Type(() => Number)
  cardNumber: number;

  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  cardExpirationDate: Date;

  @IsNumber()
  @Type(() => Number)
  cardCVV: string;
}
