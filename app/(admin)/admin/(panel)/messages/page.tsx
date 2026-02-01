import { prisma } from "@/lib/prismaClient";
import MessagesList from "./MessagesList";

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  body: string;
  is_read: boolean;
  created_at: Date;
}

async function getMessages(): Promise<Message[]> {
  const messages = await prisma.messages.findMany({
    orderBy: { created_at: "desc" },
  });
  return messages;
}

export default async function ContactPanel() {
  const messages = await getMessages();

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">Contact Messages</h1>
      <MessagesList messages={messages} />
    </div>
  );
}
