import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';

import { MoveDto, TitleDto, Title } from './dtos/title.dto';
import * as db from './db/titles.json';
import { Pago } from './dtos/pago.enum';

@Injectable()
export class AppService {
  private titles: Title[] = db as Title[];

  async getAll(): Promise<Title[]> {
    return this.titles;
  }

  async getOne(id: number): Promise<Title | boolean> {
    const userTitle = await this.titles.find((title) => title.id === id);
    return userTitle || false;
  }

  async createNew(title: TitleDto): Promise<Title> {
    const id = Math.max(...this.titles.map((titulo) => titulo.id)) + 1;
    const newTitle = {
      id,
      ...title,
    };
    this.titles.push(newTitle);
    await fsPromises.writeFile(
      'src/db/titles.json',
      JSON.stringify(this.titles, null, 2),
    );
    return newTitle;
  }

  async updateOne(id: number, amount: number): Promise<Title | boolean> {
    const userTitle = await this.titles.find((title) => title.id == id);
    if (!userTitle) return false;
    const total = userTitle.valor - amount;
    const statusPago = total <= 0;
    const updatedTitle: Title = {
      ...userTitle,
      valor: statusPago ? 0 : total,
      pagocuota: statusPago ? Pago.Y : Pago.N,
    };
    const allTitles = await this.titles.filter((title) => title.id !== id);
    const updatedTitles = [...allTitles, updatedTitle];
    await fsPromises.writeFile(
      'src/db/titles.json',
      JSON.stringify(updatedTitles, null, 2),
    );
    return updatedTitle;
  }

  async moveDate(move: MoveDto): Promise<Title[] | boolean> {
    const selectedTitles = await this.titles.filter(
      (title) => title.fecha_creacion === move.from,
    );
    if (!selectedTitles.length) return false;
    const excludedTitles = await this.titles.filter(
      (title) => title.fecha_creacion !== move.from,
    );
    const movedTitles = selectedTitles.map((title) => {
      title.fecha_creacion = move.to;
      return title;
    });
    const allTitles = [...excludedTitles, ...movedTitles];
    await fsPromises.writeFile(
      'src/db/titles.json',
      JSON.stringify(allTitles, null, 2),
    );
    return allTitles;
  }

  async deleteOne(id: number): Promise<Title[] | false> {
    const userTitle = await this.titles.find((title) => title.id == id);
    if (!userTitle) return false;
    const allTitles = this.titles.filter((title) => title.id !== id);
    await fsPromises.writeFile(
      'src/db/titles.json',
      JSON.stringify(allTitles, null, 2),
    );
    return allTitles;
  }
}
