import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('[GET] /titles should return status code 200 and data property in body', async () => {
    const response = await request(app.getHttpServer()).get('/titles');
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('data');
  });
});
