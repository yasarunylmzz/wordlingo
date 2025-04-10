export type User = {
  id: string | null;
  name: string;
  surname: string;
  username: string;
  email: string;
};

export type Auth = {
  accessToken: string;
  refreshToken: string;
};
