import { createApp } from "vue";
import "./style.css";
import index from "./App.vue";
import router from "./router/router.index";
import { createPinia } from "pinia";

const app = createApp(index);

app.use(router);
app.use(createPinia());
app.mount("#app");
