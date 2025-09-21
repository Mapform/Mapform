import { UI_MESSAGE_STREAM_HEADERS } from "ai";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { authDataService } from "~/lib/safe-action";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const chat = await authDataService.getChat({ id });

  if (chat?.data?.activeStreamId == null) {
    // no content response when there is no active stream
    return new Response(null, { status: 204 });
  }

  const streamContext = createResumableStreamContext({
    waitUntil: after,
  });

  return new Response(
    await streamContext.resumeExistingStream(chat.data.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}
