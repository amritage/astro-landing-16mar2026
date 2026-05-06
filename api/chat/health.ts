import type { IncomingMessage, ServerResponse } from "node:http";
import { proxyChat } from "./_proxy.js";

export default function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return proxyChat(req, res, "health", ["GET"]);
}
