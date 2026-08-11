import { headers } from "next/headers"

type TrpcSuccess<T> = { ok: true; data: T }
type TrpcFailure = { ok: false; message: string }
export type TrpcResult<T> = TrpcSuccess<T> | TrpcFailure

type TrpcResponse<T> = {
  result?: { data?: { json?: T } }
  error?: { json?: { message?: string } }
}

async function callTrpc<TInput, TOutput>(
  procedure: string,
  input: TInput,
): Promise<TrpcResult<TOutput>> {
  const requestHeaders = await headers()
  const response = await fetch(`${process.env.API_URL}/api/trpc/${procedure}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      cookie: requestHeaders.get("cookie") ?? "",
    },
    body: JSON.stringify({ json: input }),
  })
  const payload = (await response.json()) as TrpcResponse<TOutput>

  if (!response.ok || payload.error || payload.result?.data?.json === undefined) {
    return {
      ok: false,
      message: payload.error?.json?.message ?? "The server could not complete the request.",
    }
  }

  return { ok: true, data: payload.result.data.json }
}

export function trpcServerQuery<TInput, TOutput>(procedure: string, input: TInput) {
  return callTrpc<TInput, TOutput>(procedure, input)
}

export function trpcServerMutation<TInput, TOutput>(procedure: string, input: TInput) {
  return callTrpc<TInput, TOutput>(procedure, input)
}
