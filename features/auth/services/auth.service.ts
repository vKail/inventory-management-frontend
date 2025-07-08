import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { ILogin, ILoginResponse } from '../data/interfaces/login.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { API_ROUTES } from '@/core/data/constants/api-routes';
import axios from 'axios';

interface AuthServiceProps {
  login: (user: ILogin) => Promise<ILoginResponse | undefined>;
  logout: () => Promise<void>;
  //register: (userData: UserResponse) => Promise<UserResponse>;
}
export class AuthService implements AuthServiceProps {
  private static instance: AuthService;
  private httpClient: HttpHandler;
  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(user: ILogin): Promise<ILoginResponse | undefined> {
    try {
      const { data } = await this.httpClient.post<ILoginResponse>(API_ROUTES.AUTH.LOGIN, user);

      if (!data || !data.token) {
        console.error('Auth service: No token in response');
        throw new Error('No token received from server');
      }

      // Set the cookie
      const cookieResponse = await axios.post('/api/auth/set-cookie', JSON.stringify({ token: data.token }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (cookieResponse.data.success) {
        return data;
      } else {
        console.error('Auth service: Failed to set cookie');
        throw new Error('Failed to set authentication cookie');
      }
    } catch (error) {
      console.error('Auth service: Login error:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await axios.post(
        '/api/auth/delete-cookie',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Auth service: Logout error:', error);
      throw error;
    }
  }
}
