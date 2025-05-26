export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUserAuth;
}

export interface IUserAuth {
  id: string;
  username: string;
  career: string;
  userType: string;
  status: string;
}
