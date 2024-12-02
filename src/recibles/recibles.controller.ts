import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { ReciblesService } from './recibles.service';
import { findAllReciblesDto } from './dto/findAllRecibles.dto';
import { CreateRecibleDto } from './dto/createRecibe.dto';

@Controller('recibles')
export class ReciblesController {
  constructor(private readonly reciblesService: ReciblesService) {}

  @Post()
  create(@Body() createRecibleDto: CreateRecibleDto) {
    return this.reciblesService.create(createRecibleDto);
  }

  @Get()
  findAll(@Query() findAllReciblesDto: findAllReciblesDto) {
    return this.reciblesService.findAll(findAllReciblesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reciblesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reciblesService.remove(id);
  }
}
