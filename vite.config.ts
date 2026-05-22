import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "404": resolve(__dirname, "src/pages/404.html"),
        "500": resolve(__dirname, "src/pages/500.html"),
        changeInfo: resolve(__dirname, "src/pages/changeInfo.html"),
        changePassword: resolve(__dirname, "src/pages/changePassword.html"),
        chat: resolve(__dirname, "src/pages/chat.html"),
        chatFuctions: resolve(__dirname, "src/pages/chatFunctions.html"),
        choseChat: resolve(__dirname, "src/pages/choseChat.html"),
        deleteUset: resolve(__dirname, "src/pages/deleteUser.html"),
        downloadNewAvatar: resolve(
          __dirname,
          "src/pages/downloadNewAvatar.html",
        ),
        login: resolve(__dirname, "src/pages/login.html"),
        newAvatar: resolve(__dirname, "src/pages/newAvatar.html"),
        profile: resolve(__dirname, "src/pages/profile.html"),
        search: resolve(__dirname, "src/pages/search.html"),
        signIn: resolve(__dirname, "src/pages/signIn.html"),
      },
    },
  },
});
