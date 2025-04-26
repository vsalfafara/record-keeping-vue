export interface Credentials {
  data: UserData;
  token: string;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hasLoggedInOnce: boolean;
  createdBy: string;
  createdOn: string;
}
