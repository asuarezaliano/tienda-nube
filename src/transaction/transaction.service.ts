import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { firstValueFrom } from 'rxjs';
import { envs } from '../config/envs';
import { findAllDto } from './dto/findall.dto';
import {
  RecibleStatusType,
  TransactionType,
} from './enum/transaction-type.enum';

@Injectable()
export class TransactionService {
  private readonly apiUrl = envs.dbUrl;

  constructor(private readonly httpService: HttpService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const transactionToSave = {
        totalAmount: createTransactionDto.totalAmount,
        description: createTransactionDto.description,
        paymentMethod: createTransactionDto.paymentMethod,
        cardNumber: createTransactionDto.cardNumber.toString().slice(-4),
        cardHolderName: createTransactionDto.cardHolderName,
        cardExpirationDate: createTransactionDto.cardExpirationDate
          .toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })
          .replace('/', '/'),
        cardCvv: createTransactionDto.cardCVV,
        merchantId: createTransactionDto.merchantId,
      };

      const { data } = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/transactions`, transactionToSave),
      );

      const receivableToSave = {
        status:
          createTransactionDto.paymentMethod === TransactionType.DEBIT_CARD
            ? RecibleStatusType.PAID
            : RecibleStatusType.WAITING_FUNDS,
        create_date: new Date()
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace(/\//g, '/'),
        subtotal: Number(createTransactionDto.totalAmount),
        discount:
          createTransactionDto.paymentMethod === TransactionType.DEBIT_CARD
            ? Number(
                (Number(createTransactionDto.totalAmount) * 0.02).toFixed(2),
              )
            : Number(
                (Number(createTransactionDto.totalAmount) * 0.04).toFixed(2),
              ),
        total:
          createTransactionDto.paymentMethod === TransactionType.DEBIT_CARD
            ? Number(
                (Number(createTransactionDto.totalAmount) * 0.98).toFixed(2),
              )
            : Number(
                (Number(createTransactionDto.totalAmount) * 0.96).toFixed(2),
              ),
        transactionId: data.id,
        merchantId: createTransactionDto.merchantId,
      };

      await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/receivables`, receivableToSave),
      );

      return data;
    } catch {
      throw new Error('Error creating transaction');
    }
  }

  async findAll(findAllDto: findAllDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/transactions?merchantId=${findAllDto.merchantId}`,
        ),
      );
      return data;
    } catch {
      throw new Error('Error finding all transactions');
    }
  }

  async findOne(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/transactions/${id}`),
      );
      if (!data) {
        throw new NotFoundException(`No transaction found for id ${id}`);
      }
      return data;
    } catch {
      throw new InternalServerErrorException('Error finding transaction');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.apiUrl}/transactions/${id}`),
      );
      return data;
    } catch {
      throw new InternalServerErrorException('Error removing transaction');
    }
  }
}
