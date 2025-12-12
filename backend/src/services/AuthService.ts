import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository';
import { config } from '../config/env';
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  UserProfile,
} from '../types';

class AuthService {
  private readonly SALT_ROUNDS = 12;

  /**
   * Register a new user
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const newUser = await userRepository.create({
      ...data,
      passwordHash,
    });

    const userProfile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    const token = this.generateToken(userProfile);

    return { user: userProfile, token };
  }

  /**
   * Authenticate a user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = this.generateToken(userProfile);

    return { user: userProfile, token };
  }

  /**
   * Generate JWT for authenticated user
   */
  private generateToken(user: UserProfile): string {
    // TODO: Add expiresIn when JWT types are properly configured
    return jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret as string
    );
  }

  /**
   * Verify and decode JWT
   */
  verifyToken(token: string): {
    id: string;
    email: string;
    iat: number;
    exp: number;
  } {
    try {
      return jwt.verify(token, config.jwtSecret) as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
}

export default new AuthService();
