import { createApp } from "vue";
import "./style.css";
import index from "./App.vue";
import router from "./router/router.index";
import { createPinia } from "pinia";
import { APPNAME } from "./lib/constants";

const app = createApp(index);

app.use(router);
app.use(createPinia());
app.mount("#app");

document.title = APPNAME;
