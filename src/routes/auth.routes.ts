import { FastifyInstance } from "fastify";
import { login, logout, register } from "../controllers/auth.controller";

export async function authRouter(fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.post("/logout", logout);
}
