// components/admin-panel/MessagesList.tsx
"use client";

import { useState } from "react";

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  body: string;
  is_read: boolean;
  created_at: Date;
}

export default function MessagesList({
  messages: initialMessages,
}: {
  messages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const markAsRead = async (id: string) => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: true }),
    });

    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)),
    );
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    const res = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4 border rounded">
      {/* Message List */}
      <div className="w-1/3 flex flex-col border-r">
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm text-gray-600">
            {messages.filter((m) => !m.is_read).length} unread
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="p-4 text-gray-500">No messages yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleSelectMessage(message)}
                className={`
                  p-4 border-b cursor-pointer transition
                  hover:bg-gray-50
                  ${selectedMessage?.id === message.id ? "bg-blue-50" : ""}
                  ${!message.is_read ? "bg-blue-50/50 font-semibold" : ""}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{message.sender_name}</span>
                  {!message.is_read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {message.sender_email}
                </p>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {message.body}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(message.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <>
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedMessage.sender_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedMessage.sender_email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(selectedMessage.created_at).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="whitespace-pre-wrap">{selectedMessage.body}</div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
