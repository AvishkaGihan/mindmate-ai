import request from 'supertest';
import { app } from '../src/app';
import { pool, connectDatabase } from '../src/config/database';

describe('Sync Endpoints', () => {
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
      await pool.query('TRUNCATE TABLE moods CASCADE');
      await pool.query('TRUNCATE TABLE journals CASCADE');
    } catch (error) {
      // Table might not exist yet, skip cleanup
      console.warn('Could not truncate tables:', error);
    }
  });

  const getAuthToken = async () => {
    const user = {
      name: 'Sync Tester',
      email: 'sync@example.com',
      password: 'password123',
    };
    const res = await request(app).post('/api/v1/auth/signup').send(user);
    return res.body.data.token;
  };

  describe('POST /api/v1/sync', () => {
    it('should process a batch of valid operations', async () => {
      const token = await getAuthToken();
      const operations = [
        {
          type: 'mood:created',
          clientId: 'client-op-1',
          enqueuedAt: new Date().toISOString(),
          data: {
            moodScore: 5,
            moodTags: ['sync-test'],
            timestamp: new Date().toISOString(),
          },
        },
        {
          type: 'journal:created', // Assuming generic handling or specific handler exists
          clientId: 'client-op-2',
          enqueuedAt: new Date().toISOString(),
          data: {
            content: 'encrypted-content',
            timestamp: new Date().toISOString(),
          },
        },
      ];

      const response = await request(app)
        .post('/api/v1/sync')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('syncCursor');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBe(2);

      // Check individual operation results
      const op1Result = response.body.results.find(
        (r: Record<string, unknown>) => r.operationId === 'client-op-1'
      );
      expect(op1Result.status).toBe('success');
    });

    it('should handle partial failures in a batch (Multi-Status pattern)', async () => {
      const token = await getAuthToken();
      const operations = [
        {
          type: 'mood:created',
          clientId: 'valid-op',
          enqueuedAt: new Date().toISOString(),
          data: { moodScore: 4, timestamp: new Date().toISOString() },
        },
        {
          type: 'mood:created',
          clientId: 'invalid-op',
          enqueuedAt: new Date().toISOString(),
          data: { moodScore: 10 }, // Invalid score
        },
      ];

      const response = await request(app)
        .post('/api/v1/sync')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations });

      expect(response.status).toBe(200); // 200 OK because the batch request was received

      const validResult = response.body.results.find(
        (r: Record<string, unknown>) => r.operationId === 'valid-op'
      );
      const invalidResult = response.body.results.find(
        (r: Record<string, unknown>) => r.operationId === 'invalid-op'
      );

      expect(validResult.status).toBe('success');
      expect(invalidResult.status).toBe('error');
      expect(invalidResult.error).toBeDefined();
    });

    it('should reject malformed requests', async () => {
      const token = await getAuthToken();
      const response = await request(app)
        .post('/api/v1/sync')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: 'not-an-array' });

      expect(response.status).toBe(400); // Validation error
    });
  });
});
