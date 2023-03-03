import {
  NotFoundException,
  UnprocessableEntityException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MoveDto, TitleDto } from './dtos/title.dto';

@Controller('titles')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async allTitles() {
    const data = await this.appService.getAll();
    return {
      statusCode: 200,
      message: 'List of titles',
      total: data.length,
      data,
    };
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.appService.getOne(id);
    if (!data) {
      throw new NotFoundException(`Title not found`);
    }
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }

  @Post()
  async createNew(@Body() payload: TitleDto) {
    const data = await this.appService.createNew(payload);
    if (!data) {
      throw new UnprocessableEntityException(
        `User already has ${payload.idtitulo} title`,
      );
    }
    return {
      statusCode: 200,
      message: 'The title was associated successfully',
      data,
    };
  }

  @Patch('/move')
  async moveDate(@Body() payload: MoveDto) {
    const data = await this.appService.moveDate(payload);
    if (!data) {
      throw new NotFoundException(`There are not titles`);
    }
    return {
      statusCode: 200,
      message: 'Titles were moved successfully',
      data,
    };
  }

  @Patch(':title')
  async updateOne(
    @Param('title', ParseIntPipe) title: number,
    @Body('amount', ParseIntPipe) amount: number,
  ) {
    const data = await this.appService.updateOne(title, amount);
    if (!data) {
      throw new NotFoundException(`Title not found`);
    }
    return {
      statusCode: 200,
      message: `Title ${title} was updated successfully`,
      data,
    };
  }

  @Delete(':title')
  async deleteOne(@Param('title', ParseIntPipe) title: number) {
    const data = await this.appService.deleteOne(title);
    if (!data) {
      throw new NotFoundException(`Title not found`);
    }
    return {
      statusCode: 200,
      message: `Title ${title} was deleted successfully`,
      data,
    };
  }
}
