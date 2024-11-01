import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RegisterDto } from '../src/modules/auth/dtos';
import { DatabaseService } from '../src/modules/database/database.service';
import { usersTable } from '../src/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { RedisService } from '../src/modules/redis/redis.service';

let app: INestApplication;
let databaseService: DatabaseService;
let redisService: RedisService;

const userEmail = 'johndoe@gmail.com';
const userEmail2 = 'johndoe2@gmail.com';
const userPassword = 'testpassword';
const registerDto: RegisterDto = {
  firstName: 'John',
  lastName: 'Doe',
  email: userEmail,
  password: userPassword,
};
const registerDto2: RegisterDto = {
  firstName: 'John',
  lastName: 'Doe',
  email: userEmail2,
  password: userPassword,
};
const loginDto = {
  email: userEmail,
  password: userPassword,
};

describe('UserController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    redisService = moduleFixture.get<RedisService>(RedisService);
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
  });

  beforeEach(async () => {
    await redisService.clearAll();
  });

  afterEach(async () => {
    await databaseService.db
      .delete(usersTable)
      .where(inArray(usersTable.email, [userEmail, userEmail2]));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users/all (GET)', () => {
    it('should throw 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/users/all').expect(401);
    });

    it('should return users', async () => {
      const access = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users/all')
        .auth(access.body.accessToken, { type: 'bearer' })
        .expect(200);

      response.body.forEach((user) => {
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('id');
        expect(user).not.toHaveProperty('password');
      });
    });
  });

  describe('/users/paginated (GET)', () => {
    it('should throw 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/users/paginated').expect(401);
    });

    it('should return users', async () => {
      const access = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users/paginated')
        .auth(access.body.accessToken, { type: 'bearer' })
        .expect(200);

      response.body.forEach((user) => {
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('id');
        expect(user).not.toHaveProperty('password');
      });
    });
  });

  describe('/users/me (GET)', () => {
    it('should throw 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/users/all').expect(401);
    });

    it('should return user', async () => {
      const access = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .auth(access.body.accessToken, { type: 'bearer' })
        .expect(200);

      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('id');
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('/users/one/:id (GET)', () => {
    it('should throw 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/users/all').expect(401);
    });

    it('should return user', async () => {
      const access = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const user2 = await databaseService.db
        .insert(usersTable)
        .values(registerDto2)
        .returning()
        .execute();
      const response = await request(app.getHttpServer())
        .get('/users/one/' + user2[0].id)
        .auth(access.body.accessToken, { type: 'bearer' })
        .expect(200);

      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('id');
      expect(response.body).not.toHaveProperty('password');
    });
  });
});

describe('AuthController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    redisService = moduleFixture.get<RedisService>(RedisService);
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
  });

  beforeEach(async () => {
    await redisService.clearAll();
  });

  afterEach(async () => {
    await databaseService.db
      .delete(usersTable)
      .where(eq(usersTable.email, userEmail));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return an access token when credentials are valid', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 400 for invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const loginDto = {
        email: userEmail,
        password: userPassword + 'invalid',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(400);
    });
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user and return an access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 400 for duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });
});
