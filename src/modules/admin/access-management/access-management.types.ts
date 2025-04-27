export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: ["ADMIN", "ACCOUNTS_CLERK"];
  hasLoggedInOnce: boolean;
  createdBy: string;
  createdOn: string;
};
