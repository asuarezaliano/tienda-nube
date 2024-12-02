import { Injectable } from '@nestjs/common';
import { findAllReciblesDto } from './dto/findAllRecibles.dto';
import { firstValueFrom } from 'rxjs';
import { envs } from '../config/envs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ReciblesService {
  private readonly apiUrl = envs.dbUrl;

  constructor(private readonly httpService: HttpService) {}

  async findAll(findAllReciblesDto: findAllReciblesDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/receivables?merchantName=${findAllReciblesDto.merchantName}`,
        ),
      );

      const filter;

      console.log({ recibos: data });
      return data;
    } catch (error) {
      throw new Error('Error finding receivables');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} recible`;
  }

  remove(id: number) {
    return `This action removes a #${id} recible`;
  }
}
