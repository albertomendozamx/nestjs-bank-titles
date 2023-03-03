import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
      const newTitle = {
        idtitulo: IDTitle.tesp,
        titulo: Description.tesp,
        clasificacion: '',
        valor: 0,
        fecha_creacion: '2023-01-01',
        fecha_vencimiento: '2023-02-01',
        pagocuota: Pago.N,
      };
      const response = await appController.createNew(newTitle);
      expect(response.data).toHaveProperty('id');
    });

    it('createNew should return UnprocessableEntityException if kind of title exists', async () => {
      const newTitle = {
        idtitulo: IDTitle.usd,
        titulo: Description.usd,
        clasificacion: '',
        valor: 0,
        fecha_creacion: '2023-01-01',
        fecha_vencimiento: '2023-02-01',
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
      const response = await appController.moveDate({
        from: '2023-01-01',
        to: '2022-12-01',
      });
      expect(response.message).toBe('Titles were moved successfully');
    });

    it('moveDate should return NotFoundException when there are not titles with a date', async () => {
      try {
        await appController.moveDate({
          from: '2023-01-01',
          to: '2022-12-01',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deleteOne should return a successful message when the title was removed', async () => {
      const title = 5;
      const response = await appController.deleteOne(title);
      expect(response.message).toBe(`Title ${title} was deleted successfully`);
    });

    it('deleteOne should return NotFoundException when the title does not exist', async () => {
      try {
        await appController.deleteOne(5);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        error(error.message).toBe('Title not found');
      }
    });

    it('updateOne should return a successful message when the title was updated', async () => {
      const title = 1;
      const amount = 1000;
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
