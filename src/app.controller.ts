import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MoveDto, TitleDto, TitleUpdateDto } from './dtos/title.dto';

@Controller('titles')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async allTitles() {
    const data = await this.appService.getAll();
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.appService.getOne(id);
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }

  @Post()
  async createNew(@Body() payload: TitleDto) {
    const data = await this.appService.createNew(payload);
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }

  @Patch('/move')
  async moveDate(@Body() payload: MoveDto) {
    const data = await this.appService.moveDate(payload);
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }

  @Patch(':title')
  async updateOne(
    @Body() payload: TitleUpdateDto,
    @Param('title', ParseIntPipe) title: number,
  ) {
    const data = await this.appService.updateOne(title, payload);
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }
}
