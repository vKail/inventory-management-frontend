import { IUser, PaginatedResponse } from '../data/interfaces/user.interface';
import { API_URL } from '@/config/constants';

export class UserService {
  private static instance: UserService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/users`;
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<IUser>> {
    const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Error fetching users');
    }
    return response.json();
  }

  async getUserById(id: number): Promise<IUser> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Error fetching user');
    }
    return response.json();
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Error creating user');
    }
    return response.json();
  }

  async updateUser(id: number, user: Partial<IUser>): Promise<IUser> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Error updating user');
    }
    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting user');
    }
  }
}
