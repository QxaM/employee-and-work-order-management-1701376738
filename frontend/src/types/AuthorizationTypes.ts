export interface RegisterType {
  email: string;
  password: string;
}

export interface LoginType {
  email: string;
  password: string;
}

export interface TokenType {
  token: string;
  type: string;
  expiresIn: number;
}
