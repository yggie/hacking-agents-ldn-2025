"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { BiEqualizer } from "react-icons/bi";

export interface UIMessage {
  role: "assistant" | "user";
  content: string;
  annotated?: boolean;
}

export default function Home() {
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [audioUrl, setAudioUrl] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lastMsg = messages.at(-1);
    if (lastMsg && lastMsg.role === "assistant") {
      fetch("/api/v1/speech", {
        method: "POST",
        body: JSON.stringify({ text: lastMsg.content }),
      }).then(async (resp) => {
        const { url } = await resp.json();

        setAudioUrl(url);
      });
    } else {
      setAudioUrl("");
    }
  }, [messages]);

  return (
    <main className="w-screen h-screen overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-xl mx-auto flex flex-col h-full">
        <div className="bg-base-200 p-2 flex-1 overflow-y-scroll flex flex-col-reverse rounded-box">
          {messages.toReversed().map((message, index) => (
            <div
              className={clsx(
                "chat relative",
                message.role === "user" ? "chat-end" : "chat-start"
              )}
            >
              <div className="chat-bubble">{message.content}</div>

              {message.role === "assistant" ? (
                <button
                  type="button"
                  className="btn btn-circle btn-xs btn-soft absolute right-0 top-0"
                  onClick={() => {
                    fetch("/api/v1/annotate", {
                      method: "POST",
                      body: JSON.stringify({ text: message.content }),
                    }).then(async (resp) => {
                      const { text } = await resp.json();

                      // hack
                      message.content = text;
                      setMessages((msgs) => [...msgs]);
                    });
                  }}
                >
                  <BiEqualizer />
                </button>
              ) : null}
            </div>
          ))}
          <div className="divider opacity-50" />
          <div className="flex flex-row justify-center">
            <span className="opacity-50 italic text-sm">
              Sarah Morgan picks up the phone
            </span>
          </div>
        </div>

        {audioUrl ? (
          <div className="p-1">
            <audio src={audioUrl} controls autoPlay className="w-full" />
          </div>
        ) : null}

        <form
          className="join w-full py-1"
          onSubmit={(ev) => {
            ev.preventDefault();

            if (inputRef.current) {
              const text = inputRef.current.value;
              const newMessages = [
                ...messages,
                { role: "user" as const, content: text },
              ];
              setMessages(newMessages);
              setIsUserTurn(false);
              inputRef.current.value = "";

              fetch("/api/v1/chat", {
                method: "POST",
                headers: {
                  accept: "application/json",
                },
                body: JSON.stringify({
                  messages: newMessages,
                }),
              })
                .then(async (resp) => {
                  const { text } = await resp.json();

                  setMessages((msgs) => [
                    ...msgs,
                    { role: "assistant", content: text },
                  ]);
                })
                .finally(() => {
                  setIsUserTurn(true);
                });
            }
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="input join-item flex-1 rounded-l-full"
          />

          <button
            type="submit"
            disabled={!isUserTurn}
            className="btn join-item rounded-r-full"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
