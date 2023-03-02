import { Injectable } from '@nestjs/common';
import { MoveDto, TitleDto, TitleUpdateDto } from './dtos/title.dto';

@Injectable()
export class AppService {
  async getAll() {
    return [];
  }

  async getOne(id: number) {
    return {
      id,
    };
  }

  async createNew(title: TitleDto) {
    return {
      ...title,
    };
  }

  async updateOne(title: number, changues: TitleUpdateDto) {
    return {
      id: title,
      ...changues,
    };
  }

  async moveDate(move: MoveDto) {
    return {
      ...move,
    };
  }
}
