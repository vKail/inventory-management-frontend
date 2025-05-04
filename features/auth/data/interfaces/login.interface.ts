import { IUserResponse } from "@/features/users/data/interfaces/user.interface";

export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    user:  IUserResponse;
}


