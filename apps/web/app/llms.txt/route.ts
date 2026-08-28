import { buildLlmsText } from "@/lib/llms";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
