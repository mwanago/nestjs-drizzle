import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { DrizzleService } from '../database/drizzle.service';
import { CategoriesController } from './categories.controller';

describe('The CategoriesController', () => {
  let app: INestApplication;
  let findFirstMock: jest.Mock;
  beforeEach(async () => {
    findFirstMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: DrizzleService,
          useValue: {
            db: {
              query: {
                categories: {
                  findFirst: findFirstMock,
                },
              },
            },
          },
        },
      ],
      controllers: [CategoriesController],
      imports: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  describe('when the GET /categories/:id endpoint is called', () => {
    describe('and the category with a given id exists', () => {
      beforeEach(() => {
        findFirstMock.mockResolvedValue({
          id: 1,
          name: 'My category',
          categoriesArticles: [],
        });
      });
      it('should respond with the category', () => {
        return request(app.getHttpServer()).get('/categories/1').expect({
          id: 1,
          name: 'My category',
          articles: [],
        });
      });
    });
    describe('and the category with a given id does not exist', () => {
      beforeEach(() => {
        findFirstMock.mockResolvedValue(undefined);
      });
      it('should respond with the 404 status', () => {
        return request(app.getHttpServer()).get('/categories/2').expect(404);
      });
    });
  });
});
