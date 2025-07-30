export interface Credentials {
  login: string;
  password: string;
}

export interface Token {
  token: string;
  type: string;
  expiresIn: number;
}
