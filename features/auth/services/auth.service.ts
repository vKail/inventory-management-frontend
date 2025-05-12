import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { ILogin, ILoginResponse } from '../data/interfaces/login.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { API_ROUTES } from '@/core/data/constants/api-routes';
import axios from 'axios';
import { waitForDebugger } from 'inspector';

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

      await axios.post('/api/auth/set-cookie', JSON.stringify({ token: data.token }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!data) return;

      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    await axios.post(
      '/api/auth/delete-cookie',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
