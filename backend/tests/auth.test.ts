import request from 'supertest';
import { app } from '../src/app';
import { pool, connectDatabase } from '../src/config/database';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    // Clean up users table before each test to ensure isolation
    // Note: This assumes you have a users table - adjust table names as needed
    try {
      await pool.query('TRUNCATE TABLE users CASCADE');
    } catch (error) {
      // Table might not exist yet, skip cleanup
      console.warn('Could not truncate users table:', error);
    }
  });

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/v1/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should fail with validation errors for invalid data', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        name: 'Te', // Too short
        email: 'invalid-email',
        password: '123', // Too short
      });

      expect(response.status).toBe(422); // Validation error
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail when registering with an existing email', async () => {
      // First registration
      await request(app).post('/api/v1/auth/signup').send(testUser);

      // Duplicate registration
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(testUser);

      expect(response.status).toBe(400); // Bad Request or 409 Conflict depending on service logic
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Seed a user for login tests
      await request(app).post('/api/v1/auth/signup').send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should fail login with incorrect password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should fail login for non-existent user', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      // Usually returns 401 for security, sometimes 404
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
