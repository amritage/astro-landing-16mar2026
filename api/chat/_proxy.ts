import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";

type ChatProxyRequest = IncomingMessage & {
  body?: unknown;
};

const DEFAULT_API_BASE = "https://espobackend.vercel.app";

function normalizeBaseUrl(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return DEFAULT_API_BASE;
  }
  return trimmed.replace(/\/$/, "");
}

function headerValue(headers: IncomingHttpHeaders, key: string): string | undefined {
  const value = headers[key];
  if (Array.isArray(value)) return value[0];
  return typeof value === "string" ? value : undefined;
}

function proxyHeaders(req: ChatProxyRequest): Record<string, string> {
  return {
    accept: "application/json",
    "content-type": headerValue(req.headers, "content-type") ?? "application/json",
  };
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readBody(req: ChatProxyRequest): Promise<string | undefined> {
  if (req.body !== undefined) {
    if (typeof req.body === "string") return req.body;
    if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
    return JSON.stringify(req.body);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return chunks.length ? Buffer.concat(chunks).toString("utf8") : undefined;
}

export async function proxyChat(
  req: ChatProxyRequest,
  res: ServerResponse,
  path: "health" | "message",
  allowedMethods: string[],
): Promise<void> {
  const method = (req.method ?? "GET").toUpperCase();
  res.setHeader("Cache-Control", "no-store");

  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!allowedMethods.includes(method)) {
    res.setHeader("Allow", allowedMethods.join(", "));
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = method === "GET" || method === "HEAD" ? undefined : await readBody(req);
    const upstream = await fetch(`${normalizeBaseUrl(process.env.PUBLIC_API_BASE_URL)}/api/chat/${path}`, {
      method,
      headers: proxyHeaders(req),
      body,
    });
    const text = await upstream.text();

    res.statusCode = upstream.status;
    res.setHeader("Content-Type", upstream.headers.get("content-type") ?? "application/json; charset=utf-8");
    res.end(text);
  } catch {
    sendJson(res, 502, { ok: false, error: "Chat backend unavailable" });
  }
}
