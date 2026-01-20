import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares";

const app = express();

// Apply CORS BEFORE auth routes
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Auth handler must come after CORS
app.use("/api/auth/", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

export default app;
