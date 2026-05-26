const express = require("express");
const path = require("path");
const { createServer } = require("vite");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const pages = [
  { url: "/404", file: "404.html", status: 404 },
  { url: "/500", file: "500.html", status: 500 },
  { url: "/login", file: "login.html" },
  { url: "/signup", file: "signUp.html" },
  { url: "/chose-chat", file: "choseChat.html" },
  { url: "/chat", file: "chat.html" },
  { url: "/search", file: "search.html" },
  { url: "/chat-fuction", file: "chatFunctions.html" },
  { url: "/delete-user", file: "deleteUser.html" },
  { url: "/profile", file: "profile.html" },
  { url: "/change-info", file: "changeInfo.html" },
  { url: "/change-password", file: "changePassword.html" },
  { url: "/new-avatar", file: "newAvatar.html" },
  { url: "/download-new-avatar", file: "downloadNewAvatar.html" },
];

(async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);

  app.get("/", async (req, res) => {
    const url = "index.html";
    const html = await vite.transformIndexHtml(
      url,
      await fs.promises.readFile(path.resolve(__dirname, url), "utf-8"),
    );
    res.send(html);
  });

  pages.forEach(({ url, file, status }) => {
    app.get(url, async (req, res) => {
      const srcPath = path.join("src", "pages", file);
      const html = await vite.transformIndexHtml(
        "/" + srcPath,
        await fs.promises.readFile(path.resolve(__dirname, srcPath), "utf-8"),
      );
      if (status) res.status(status);

      res.send(html);
    });
  });

  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
})();
