import type { IncomingMessage, ServerResponse } from 'node:http';

export function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
): Promise<void>;
