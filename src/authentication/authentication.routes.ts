export const authenticationRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("./Login.vue"),
  },
];
