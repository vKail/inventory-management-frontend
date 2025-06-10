import { IUser, PaginatedResponse, ApiResponse } from '@/features/users/data/interfaces/user.interface';
import { API_URL } from '@/config/constants';

export class UserService {
  private static instance: UserService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}users`;
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUsers(page: number = 1, limit: number = 10, filters?: { userName?: string; dni?: string; status?: string }): Promise<PaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.userName) {
      params.append('userName', filters.userName);
    }

    if (filters?.dni) {
      params.append('dni', filters.dni);
    }

    if (filters?.status) {
      params.append('status', filters.status);
    }

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Error fetching users');
    }
    const apiResponse: ApiResponse<PaginatedResponse> = await response.json();
    return apiResponse.data;
  }

  async getUserById(id: string): Promise<IUser> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Error fetching user');
    }
    const apiResponse: ApiResponse<IUser> = await response.json();
    return apiResponse.data;
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const userData = {
      userName: user.userName,
      password: user.password,
      career: user.career,
      userType: user.userType,
      status: user.status || 'ACTIVE',
      person: user.person
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Error creating user');
    }
    const apiResponse: ApiResponse<IUser> = await response.json();
    return apiResponse.data;
  }

  async updateUser(id: string, user: Partial<IUser>): Promise<IUser> {
    const userData = {
      userName: user.userName,
      password: user.password,
      career: user.career,
      userType: user.userType,
      status: user.status || 'ACTIVE',
      person: user.person
    };

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Error updating user');
    }
    const apiResponse: ApiResponse<IUser> = await response.json();
    return apiResponse.data;
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/change-status/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'INACTIVE' }),
    });
    if (!response.ok) {
      throw new Error('Error deleting user');
    }
    await response.json();
  }
}
