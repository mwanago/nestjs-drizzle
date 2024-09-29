import * as request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { DrizzleService } from '../database/drizzle.service';
import { CategoriesController } from './categories.controller';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { CategoryDto } from './dto/category.dto';

describe('The CategoriesController', () => {
  let app: INestApplication;
  let findFirstMock: jest.Mock;
  let drizzleInsertReturningMock: jest.Mock;
  beforeEach(async () => {
    drizzleInsertReturningMock = jest.fn().mockResolvedValue([]);
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
              insert: jest.fn().mockReturnThis(),
              values: jest.fn().mockReturnThis(),
              returning: drizzleInsertReturningMock,
            },
          },
        },
      ],
      controllers: [CategoriesController],
      imports: [],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            id: 1,
            name: 'John Smith',
          };
          return true;
        },
      })
      .compile();

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
  describe('when the POST /categories endpoint is called', () => {
    describe('and the correct data is provided', () => {
      let categoryData: CategoryDto;
      beforeEach(() => {
        categoryData = {
          name: 'New category',
        };
        drizzleInsertReturningMock.mockResolvedValue([
          {
            id: 2,
            ...categoryData,
          },
        ]);
      });
      it('should respond with the new category', () => {
        return request(app.getHttpServer())
          .post('/categories')
          .send(categoryData)
          .expect({
            id: 2,
            ...categoryData,
          });
      });
    });
  });
});
