import { FastifyRequest } from "fastify";
import { User } from "../generated/client";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}
