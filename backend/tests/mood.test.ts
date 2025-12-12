import request from 'supertest';
import { app } from '../src/app';
import { pool, connectDatabase } from '../src/config/database';

describe('Mood Endpoints', () => {
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
    } catch (error) {
      // Table might not exist yet, skip cleanup
      console.warn('Could not truncate tables:', error);
    }
  });

  const getAuthToken = async () => {
    const user = {
      name: 'Mood Tester',
      email: 'mood@example.com',
      password: 'password123',
    };
    const res = await request(app).post('/api/v1/auth/signup').send(user);
    return res.body.data.token;
  };

  describe('POST /api/v1/moods', () => {
    it('should create a mood entry successfully', async () => {
      const token = await getAuthToken();
      const moodData = {
        moodScore: 4,
        moodTags: ['happy', 'productive'],
        context: { activity: 'coding' },
        timestamp: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/api/v1/moods')
        .set('Authorization', `Bearer ${token}`)
        .send(moodData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.moodScore).toBe(4);
      expect(response.body.data.moodTags).toContain('happy');
    });

    it('should fail if mood score is out of range', async () => {
      const token = await getAuthToken();
      const response = await request(app)
        .post('/api/v1/moods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          moodScore: 6, // Invalid: must be 1-5
        });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/moods')
        .send({ moodScore: 3 });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/moods', () => {
    it('should retrieve mood history with filters', async () => {
      const token = await getAuthToken();

      // Seed data
      await request(app)
        .post('/api/v1/moods')
        .set('Authorization', `Bearer ${token}`)
        .send({ moodScore: 3, timestamp: new Date().toISOString() });

      await request(app)
        .post('/api/v1/moods')
        .set('Authorization', `Bearer ${token}`)
        .send({ moodScore: 5, timestamp: new Date().toISOString() });

      const response = await request(app)
        .get('/api/v1/moods?limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });
});
