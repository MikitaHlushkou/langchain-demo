"use client";
import { useEffect, useRef, useState } from "react";

import styles from "./index.module.css";
import { ChatService } from "./chat.module";

const classnames = (...classes: string[]) => classes.join(" ");

interface Message {
  id: string;
  text: string;
  owner: Owner;
}

enum Owner {
  User = "user",
  AI = "ai",
}

export const Chat = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isShown, setIsShown] = useState(false);
  const chatModuleRef = useRef<ChatService>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chatModuleRef.current) {
      chatModuleRef.current = new ChatService();
    }
  }, []);

  const addMessageToHistory = (message: string, owner: Owner) => {
    setChatHistory((prev) => [
      ...prev,
      { id: performance.now().toString(), text: message, owner },
    ]);
  };

  const sendMessage = async () => {
    try {
      setIsLoading(true);
      addMessageToHistory(inputValue, Owner.User);
      setInputValue("");

      const data = await chatModuleRef.current!.sendMessage(inputValue);
      addMessageToHistory(data.response, Owner.AI);
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      sendMessage();
      e.preventDefault();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsShown((a) => !a)}
        className={
          "flex items-center justify-center p-6 w-12 h-12 absolute bottom-12 right-12 rounded-full border-none cursor-pointer bg-amber-300 "
        }
      >
        AI
      </button>
      {isShown && (
        <div
          className={
            "w-[400px] h-[600px] border-gray-400 rounded-lg absolute flex flex-col right-8 bottom-8 bg-[#262424]"
          }
        >
          <div className={"p-2 border-b border-gray-400 text-center"}>
            Chat with AI assistant
          </div>
          <button
            className={
              "absolute p-0.5 top-1.5 right-2.5 cursor-pointer bg-transparent border-none"
            }
            onClick={() => setIsShown(false)}
          >
            X
          </button>
          <div className={"flex-1 overflow-auto flex flex-col p-4 gap-2"}>
            {chatHistory.map((message) => (
              <div
                className={classnames(
                  "text-base max-w-[70%] w-fit p-1 px-3 rounded-lg break-words whitespace-pre-wrap",
                  message.owner === "ai"
                    ? " bg-blue-500"
                    : "bg-[#444343] self-end"
                )}
                key={message.id}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form className={"flex h-15 p-2 gap-1"} onSubmit={onSubmit}>
            <textarea
              rows={2}
              disabled={isLoading}
              value={inputValue}
              onKeyDown={onKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your question"
              className={"flex-1 text-base resize-none p-1"}
            />
            <button className={"p-2"} type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};
