import { pool } from '../config/database';
import { User, SignupRequest } from '../types';

class UserRepository {
  /**
   * Create a new user with hashed password
   */
  async create(user: SignupRequest & { passwordHash: string }): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt";
    `;
    const values = [user.email, user.passwordHash];
    const result = await pool.query<User>(query, values);
    return result.rows[0];
  }

  /**
   * Find user by email address
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      WHERE email = $1;
    `;
    const result = await pool.query<User>(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      WHERE id = $1;
    `;
    const result = await pool.query<User>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Delete user and all associated data (via ON DELETE CASCADE)
   */
  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1;';
    await pool.query(query, [id]);
  }
}

export default new UserRepository();
