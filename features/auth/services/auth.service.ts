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
      console.log('Auth service: Making login request...');
      const { data } = await this.httpClient.post<ILoginResponse>(API_ROUTES.AUTH.LOGIN, user);
      console.log('Auth service: Login response received:', data);

      if (!data || !data.token) {
        console.error('Auth service: No token in response');
        throw new Error('No token received from server');
      }

      console.log('Auth service: Setting cookie...');
      // Set the cookie
      const cookieResponse = await axios.post('/api/auth/set-cookie', JSON.stringify({ token: data.token }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Auth service: Cookie response:', cookieResponse.data);

      if (cookieResponse.data.success) {
        console.log('Auth service: Cookie set successfully');
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
      console.log('Auth service: Logging out...');
      await axios.post(
        '/api/auth/delete-cookie',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Auth service: Logout completed');
    } catch (error) {
      console.error('Auth service: Logout error:', error);
      throw error;
    }
  }
}
