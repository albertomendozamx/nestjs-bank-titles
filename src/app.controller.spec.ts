import * as dayjs from 'dayjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { save } from './db/utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pago } from './dtos/pago.enum';
import { IDTitle } from './dtos/title.enum';
import { Description } from './dtos/description.enum';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    const { data } = await appController.allTitles();
    const resetData = await data.filter((title) => title.id < 4);
    await save(resetData);
  });

  describe('root', () => {
    it('allTitles should have data array property', async () => {
      const response = await appController.allTitles();
      expect(typeof response.data.length).toBe('number');
    });

    it('getOne should return an object if exist', async () => {
      const response = await appController.getOne(1);
      expect(response.data).toHaveProperty('id');
    });

    it('getOne should return NotFoundException if does not exits', async () => {
      try {
        await appController.getOne(1000);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('createNew should return a new Title', async () => {
      const { data } = await appController.allTitles();
      const selected: string[] = data.map((title) => title.idtitulo);
      const availables = Object.keys(IDTitle).filter(
        (id) => !selected.includes(id),
      );
      const idtitulo = IDTitle[availables[0]];
      const titulo = Description[availables[0]];

      const newTitle = {
        idtitulo,
        titulo,
        clasificacion: '',
        valor: 0,
        fecha_creacion: dayjs().format('YYYY-MM-DD'),
        fecha_vencimiento: dayjs().add(6, 'M').format('YYYY-MM-DD'),
        pagocuota: Pago.N,
      };
      const response = await appController.createNew(newTitle);
      expect(response.data).toHaveProperty('id');
    });

    it('createNew should return UnprocessableEntityException if kind of title does not exist', async () => {
      const newTitle = {
        idtitulo: IDTitle.USD,
        titulo: Description.USD,
        clasificacion: '',
        valor: 0,
        fecha_creacion: dayjs().format('YYYY-MM-DD'),
        fecha_vencimiento: dayjs().format('YYYY-MM-DD'),
        pagocuota: Pago.N,
      };
      try {
        await appController.createNew(newTitle);
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException);
        expect(error.message).toBe(
          `User already has ${newTitle.idtitulo} title`,
        );
      }
    });

    it('moveDate should return a successful message when titles were moved', async () => {
      const { data } = await appController.allTitles();
      const from = data[0].fecha_creacion;
      const to = dayjs().add(6, 'M').format('YYYY-MM-DD');
      const response = await appController.moveDate({ from, to });
      expect(response.message).toBe('Titles were moved successfully');
    });

    it('moveDate should return NotFoundException when there are not titles with a date', async () => {
      try {
        await appController.moveDate({
          from: '2000-01-01',
          to: '2001-12-01',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deleteOne should return a successful message when the title was removed', async () => {
      const { data } = await appController.allTitles();
      const id = Math.max(...data.map((titulo) => titulo.id));
      const title = id;
      const response = await appController.deleteOne(title);
      expect(response.message).toBe(`Title ${title} was deleted successfully`);
    });

    it('deleteOne should return NotFoundException when the title does not exist', async () => {
      try {
        await appController.deleteOne(-1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Title not found');
      }
    });

    it('updateOne should return a successful message when the title was updated', async () => {
      const title = 1;
      const amount = 1000;
      const response = await appController.updateOne(title, amount);
      expect(response.message).toBe(`Title ${title} was updated successfully`);
    });

    it('updateOne should return a successful message when the title was paid', async () => {
      const { data } = await appController.allTitles();
      const title = data[0].id;
      const amount = data[0].valor;
      const response = await appController.updateOne(title, amount);
      expect(response.message).toBe(`Title ${title} was updated successfully`);
    });

    it('updateOne should return NotFoundException when title does not exist', async () => {
      const title = 1000;
      const amount = 1000;
      try {
        await appController.updateOne(title, amount);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Title not found');
      }
    });
  });
});
