import { Server } from "http";
import app from "./app";

const port = process.env.PORT || 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("Court Server running on port ", port);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}

main();
