const app = require("./app");

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", () => {
  server.close();
  console.log("Process terminated");
});
