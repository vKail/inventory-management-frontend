import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { IState, PaginatedResponse, ApiResponse } from '../data/interfaces/state.interface';

interface StateServiceProps {
  getStates: (page?: number, limit?: number) => Promise<PaginatedResponse<IState>>;
  getStateById: (id: number) => Promise<IState | undefined>;
  createState: (state: Partial<IState>) => Promise<IState | undefined>;
  updateState: (id: number, state: Partial<IState>) => Promise<IState | undefined>;
  deleteState: (id: number) => Promise<void>;
}

export class StateService implements StateServiceProps {
  private static instance: StateService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}states`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): StateService {
    if (!StateService.instance) {
      StateService.instance = new StateService();
    }
    return StateService.instance;
  }

  public async getStates(page = 1, limit = 10): Promise<PaginatedResponse<IState>> {
    try {
      const response = await this.httpClient.get<ApiResponse<PaginatedResponse<IState>>>(
        `${StateService.url}?page=${page}&limit=${limit}`
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error;
    }
  }

  public async getStateById(id: number): Promise<IState | undefined> {
    try {
      const response = await this.httpClient.get<ApiResponse<IState>>(`${StateService.url}/${id}`);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching state:', error);
      return undefined;
    }
  }

  public async createState(state: Partial<IState>): Promise<IState | undefined> {
    try {
      const response = await this.httpClient.post<ApiResponse<IState>>(
        StateService.url,
        state
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating state:', error);
      throw error;
    }
  }

  public async updateState(id: number, state: Partial<IState>): Promise<IState | undefined> {
    try {
      const response = await this.httpClient.patch<ApiResponse<IState>>(
        `${StateService.url}/${id}`,
        state
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating state:', error);
      throw error;
    }
  }

  public async deleteState(id: number): Promise<void> {
    try {
      const response = await this.httpClient.delete<ApiResponse<void>>(`${StateService.url}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message.content.join(', '));
      }
    } catch (error) {
      console.error('Error deleting state:', error);
      throw error;
    }
  }
}

export const stateService = StateService.getInstance();

