export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  role: string;
};

export type Credentials = {
  emailAddress: string;
  password: string;
};
