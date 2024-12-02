import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { findAllReciblesDto } from './dto/findAllRecibles.dto';
import { firstValueFrom } from 'rxjs';
import { envs } from '../config/envs';
import { HttpService } from '@nestjs/axios';
import { CreateRecibleDto } from './dto/createRecibe.dto';

@Injectable()
export class ReciblesService {
  private readonly apiUrl = envs.dbUrl;

  constructor(private readonly httpService: HttpService) {}

  async create(createRecibleDto: CreateRecibleDto) {
    try {
      const { data: transaction } = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/transactions/${createRecibleDto.transactionId}`,
        ),
      );

      if (!transaction) {
        throw new NotFoundException(
          `Transaction with id ${createRecibleDto.transactionId} not found`,
        );
      }

      if (transaction.merchantId !== createRecibleDto.merchantId) {
        throw new NotFoundException(
          `Transaction with id ${createRecibleDto.transactionId} does not belong to merchant ${createRecibleDto.merchantId}`,
        );
      }

      const { data } = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/receivables`, createRecibleDto),
      );
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Resource not found');
      }
      throw new InternalServerErrorException('Error creating receivable');
    }
  }

  async findAll(findAllReciblesDto: findAllReciblesDto) {
    try {
      //el httpService.get retorna un observable y para tratarlo como una promesa usamos firstValueFrom
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/receivables?merchantId=${findAllReciblesDto.merchantId}`,
        ),
      );

      const filterData = data.filter((receivable) => {
        const [day, month, year] = receivable.create_date.split('/');
        const receivableDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
        );

        const [startDay, startMonth, startYear] =
          findAllReciblesDto.startDate.split('/');
        const [endDay, endMonth, endYear] =
          findAllReciblesDto.endDate.split('/');

        const startDate = new Date(
          parseInt(startYear),
          parseInt(month) - 1,
          parseInt(startDay),
        );
        const endDate = new Date(
          parseInt(endYear),
          parseInt(endMonth) - 1,
          parseInt(endDay),
        );

        if (
          isNaN(receivableDate.getTime()) ||
          isNaN(startDate.getTime()) ||
          isNaN(endDate.getTime())
        ) {
          return false;
        }

        return receivableDate >= startDate && receivableDate <= endDate;
      });

      return filterData;
    } catch {
      throw new Error('Error finding receivables');
    }
  }

  async findOne(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/receivables/${id}`),
      );

      if (!data) {
        throw new NotFoundException(`No receivable found for id ${id}`);
      }
      return data;
    } catch {
      throw new InternalServerErrorException('Error finding receivable');
    }
  }

  async remove(id: string) {
    //eliminar el recibos no parece una buena idea, capaz se pùede hacer un soft delete para que no se eliminen los recibos
    try {
      await this.findOne(id);

      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.apiUrl}/receivables/${id}`),
      );
      return data;
    } catch {
      throw new InternalServerErrorException('Error removing receivable');
    }
  }
}
