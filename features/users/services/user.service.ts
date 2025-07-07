import { IUser, PaginatedResponse, ApiResponse, PersonApiResponse } from '@/features/users/data/interfaces/user.interface';
import { HttpHandler, IHttpResponse } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface UserServiceProps {
  getUsers: (page?: number, limit?: number, filters?: { userName?: string; dni?: string; status?: string; userType?: string; allRecords?: boolean }) => Promise<PaginatedResponse>;
  getUserById: (id: string) => Promise<IUser>;
  createUser: (user: Partial<IUser>) => Promise<IUser>;
  updateUser: (id: string, user: Partial<IUser>) => Promise<IUser>;
  changeUserStatus: (id: string, status: string) => Promise<void>;
  getPersonByDni: (dni: string) => Promise<PersonApiResponse["data"] | null>;
  getPersonById: (id: string) => Promise<PersonApiResponse["data"] | null>;
}

export class UserService implements UserServiceProps {
  private static instance: UserService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}users`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUsers(page = 1, limit = 10, filters?: { userName?: string; dni?: string; status?: string; userType?: string; allRecords?: boolean }): Promise<PaginatedResponse> {
    try {
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
      if (filters?.userType) {
        params.append('userType', filters.userType);
      }
      if (filters?.allRecords) {
        params.append('allRecords', 'true');
      }

      const response = await this.httpClient.get<PaginatedResponse>(`${UserService.url}?${params.toString()}`);
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser> {
    try {
      const response = await this.httpClient.get<IUser>(`${UserService.url}/${id}`);
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    try {
      let personType = 'DOCENTES';
      if (user.userType === 'STUDENT') {
        personType = 'ESTUDIANTES';
      }
      const { middleName, secondLastName, birthDate, ...personRest } = user.person || {};
      const userData = {
        userName: user.userName,
        password: user.password,
        career: user.career,
        userType: user.userType,
        status: user.status || 'ACTIVE',
        person: {
          ...personRest,
          type: personType
        }
      };
      const response = await this.httpClient.post<IUser>(UserService.url, userData);
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<IUser>): Promise<IUser> {
    try {
      const userData = {
        userName: user.userName,
        password: user.password,
        career: user.career,
        userType: user.userType,
        status: user.status || 'ACTIVE',
        person: user.person
      };

      const response = await this.httpClient.patch<IUser>(`${UserService.url}/${id}`, userData);
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async changeUserStatus(id: string, status: string): Promise<void> {
    try {
      const response = await this.httpClient.patch<void>(`${UserService.url}/change-status/${id}`, { status });
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
    } catch (error) {
      console.error('Error changing user status:', error);
      throw error;
    }
  }

  async getPersonByDni(dni: string): Promise<PersonApiResponse["data"] | null> {
    try {
      const response = await this.httpClient.get<PersonApiResponse["data"]>(`${process.env.NEXT_PUBLIC_API_URL}people/find-or-create/${dni}`);
      if (!response.success) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching person by DNI:', error);
      return null;
    }
  }

  async getPersonById(id: string): Promise<PersonApiResponse["data"] | null> {
    try {
      const response = await this.httpClient.get<PersonApiResponse["data"]>(`${process.env.NEXT_PUBLIC_API_URL}people/${Number(id)}`);
      if (!response.success) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching person by ID:', error);
      return null;
    }
  }

  async markAsDefaulter(personId: number, dni: string): Promise<IHttpResponse<any>> {
    try {
      const response = await this.httpClient.post<IHttpResponse<any>>(
        `${process.env.NEXT_PUBLIC_API_URL}people/mark-as-defaulter`,
        { personId, dni }
      );
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
      return response;
    } catch (error) {
      console.error('Error marking as defaulter:', error);
      throw error;
    }
  }

  async removeDefaulterStatus(personId: number, dni: string): Promise<IHttpResponse<any>> {
    try {
      const response = await this.httpClient.post<IHttpResponse<any>>(
        `${process.env.NEXT_PUBLIC_API_URL}people/remove-defaulter-status`,
        { personId, dni }
      );
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
      return response;
    } catch (error) {
      console.error('Error removing defaulter status:', error);
      throw error;
    }
  }
}
