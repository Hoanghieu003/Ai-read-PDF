import React, { useState, useEffect, useRef, useContext } from "react";
import OpenAI from "openai";
import axios from "axios";
import ChatbotIcon from "../../assets/img/ChatbotIcon";
import ReactMarkdown from "react-markdown";
import Clipboard from "@/app/assets/img/Clipboard";
import DoubleCheck from "@/app/assets/img/DoubleCheck";
import copy from "copy-text-to-clipboard";
import { ResultContext } from "./ResultContext";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

type Props = {
  sourceId: string;
  className?: string;
  fileName: string;
};

const Chat = ({ sourceId, className, fileName }: Props) => {
  const [copyText, setCopyText] = useState(false);
  const [copyIndex, setCopyIndex] = useState(0);
  const [thinking, setThinking] = useState<boolean>(false);
  const [chatText, setChatText] = useState<string>("");
  const messageShow = useRef<HTMLDivElement>(null);
  const { result, setResult } = useContext(ResultContext);
  const openAiKey = process.env.api_key;
  const openai = new OpenAI({
    apiKey: openAiKey,
    dangerouslyAllowBrowser: true,
  });

  const [buttonArray, setButtonArray] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/data", { method: "GET" });
      const data = await response.json();
      setButtonArray(data);
    }
    fetchData();
  }, []);

  const handleClipboard = (context: string, index: number) => {
    setCopyText(true);
    setCopyIndex(index + 1);
    const text = context;
    copy(text);
    setResult([...result, context]);
    setTimeout(() => {
      setCopyIndex(0);
      setCopyText(false);
    }, 500);
  };

  const ref = useRef<HTMLDivElement | null>(null);

  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const saveRequestCount = async () => {
    await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  };
  const handleSuggestion = (prompt: string) => {
    if (prompt.trim() === "") return;
    const userInput: Message = { role: "user", content: prompt };
    const updatedChatHistory = [...chatHistory];
    setChatHistory(updatedChatHistory);

    try {
      setThinking(true);

      const config = {
        headers: {
          "x-api-key": "sec_PxZwgM7psJzuQuECpHnPfihFL5ghXowP",
          "Content-Type": "application/json",
        },
      };

      const data = {
        sourceId: sourceId,
        messages: [userInput],
      };
      axios
        .post("https://api.chatpdf.com/v1/chats/message", data, config)
        .then(async (res) => {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content:
                  "please only list materila type without explanations listed in basic category for" +
                  prompt +
                  " from following data:" +
                  res.data.content +
                  "\nIf you are unable to provide me with the information I am looking for, You just answer 'Sorry i can't find the requested info, please refer to plans or designer'. If you found anything and there are some unable answer at the same time , skip only the answer that your were unable to provide me with the information and keep to answer able others. And then format with Markdown syntax",
              },
            ],
            temperature: 0,
            stream: true,
          });
          await saveRequestCount();
          setThinking(false);
          updatedChatHistory.push({ role: "assistant", content: "" });
          for await (const part of response) {
            setChatText((s) => s.concat(part.choices[0]?.delta?.content || ""));

            setChatHistory((updatedChatHistory) => {
              updatedChatHistory[updatedChatHistory.length - 1].content +=
                part.choices[0]?.delta?.content || "";
              return updatedChatHistory;
            });
            try {
              setTimeout(() => {
                if (messageShow.current) {
                  messageShow.current.scrollTop =
                    messageShow.current?.scrollHeight;
                }
              }, 100);
            } catch (error) {
              console.warn(error);
            }
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
      try {
        setTimeout(() => {
          if (messageShow.current) {
            messageShow.current.scrollTop = messageShow.current?.scrollHeight;
          }
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    } catch (error: any) {
      updatedChatHistory.pop();
      setChatHistory(updatedChatHistory);
      toast.error(error.message);
      setThinking(false);
    }
  };

  return (
    <div className={className}>
      <div className="border-gray-200 px-4 mb-1 sm:mb-0 hide overflow-auto w-1/3">
        <div className="flex flex-col gap-2 items-center overflow-auto mb-2 scrollbar-white scrollbar-thin py-5">
          {buttonArray.length > 0 &&
            buttonArray.map((item: { name: string; prompt: string }, index) => {
              return (
                <button
                  key={index}
                  className="px-2 py-1 text-white border-[1px] rounded-md duration-200 ease-in-out hover:scale-105 bg-slate-50/5 gap-y-4 hover:shadow-md hover:shadow-slate-200/20 min-w-[250px]"
                  onClick={() => handleSuggestion(item.prompt)}
                >
                  {item.name}
                </button>
              );
            })}
        </div>
      </div>
      <div className="w-2/3 px-2 overflow-hidden">
        <div className="flex sm:items-center justify-between py-3 border-b border-gray-400">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <span className="absolute text-green-300 right-0 bottom-0">
                <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
              </span>
              <ChatbotIcon className="w-10 sm:w-16 h-10 sm:h-16 rounded-full fill-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-300 mr-3">{fileName}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scroll-smooth h-[calc(100%-6rem)]"
          ref={messageShow}
        >
          {chatHistory.map((msg, i) => {
            return (
              <div className="chat-message pr-3" key={i}>
                <div
                  className={`flex items-end ${
                    msg.role !== "user" ? "" : "justify-end"
                  }`}
                >
                  <div className="flex flex-col space-y-2 text-lg max-w-2xl mx-2 order-2 items-start ">
                    <div className="relative">
                      <div
                        className={`px-4 py-2 rounded-lg inline-block  ${
                          msg.role !== "user"
                            ? "bg-gray-300 text-gray-600 rounded-bl-none"
                            : "bg-blue-600 text-white rounded-br-none"
                        }`}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>

                      <button
                        onClick={() => handleClipboard(msg.content, i)}
                        className="absolute top-1 right-1 text-white"
                      >
                        {copyText === true && copyIndex === i + 1 ? (
                          <DoubleCheck className="w-5 fill-blue-700 cursor-pointer" />
                        ) : (
                          <Clipboard className="w-5 text-zinc-700 hover:text-blue-700 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* {msg.role !== "user" ? (
                    <ChatbotIcon className="order-1 w-6 h-6 fill-white" />
                  ) : (
                    <Image
                      src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                      alt="My profile"
                      className={`rounded-full order-2`}
                      width={24}
                      height={24}
                    />
                  )} */}
                </div>
              </div>
            );
          })}
          {thinking ? (
            <div className="chat-message">
              <div className={`flex items-end`}>
                <div className="flex flex-col space-y-2 text-lg max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span
                      className={`px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600 rounded-bl-none`}
                    >
                      Um, thinking ...
                    </span>
                  </div>
                </div>
                {/* <ChatbotIcon className="order-1 w-6 h-6 fill-white" /> */}
              </div>
            </div>
          ) : null}
          {/* <div ref={messageShow}></div> */}
        </div>
      </div>
      {/* Suggestion button */}
    </div>
  );
};

export default Chat;
