'use client'
import { getAllMessage, newMessage } from "@/lib/actions";
import { socket } from "@/socket";
import { chats } from "@prisma/client";
import { useRouter } from "next/navigation";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";

export default function Home() {

  const wordWrap = (str: string, max: number, br = ' ') => str.replace(
    new RegExp(`.{1,${max}}`, 'g'), `$&${br}`
  );
  const [isConnected, setIsConnected] = useState(false);
  const [inbox, setInbox] = useState<string[]>([])
  const [savedChats, setSavedChats] = useState<chats[]>()
  const [time, setTime] = useState<number[]>([])
  const [text, setText] = useState('')


  useEffect(() => {
    async function getChatsFromDB() {
      await getAllMessage().then(messages => setSavedChats(messages));
    }

    getChatsFromDB();

  }, [])
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function sendEvent(msg: string, t: number) {
      setInbox([...inbox, msg]);
      setTime([...time, t])

      console.log("inbox", inbox);
    }

    document?.getElementById("chat")?.focus();

    function onConnect() {
      setIsConnected(true);

    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("send-event", sendEvent)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [inbox, time]);

  const onSendHandler = async (text: string) => {
    const d = new Date()
    socket.emit('send-event', text, new Date().getTime())
    await newMessage(text)
    setText('')
  }
  return (
    <main className="mx-10 p-4  relative h-screen  max-w-screen">
      <h1 className="text-center">Welcome to BaatCheet</h1>

      <div className=" w-[80%] h-[85%] carousel carousel-vertical rounded-box
      ">
        {
          savedChats?.map((chat: chats, i: number) => (
            <div key={i} className="carousel-item mb-2 bg-blue-300 w-fit px-4 py-2 text-gray-900 flex-col">
              <p className="max-w-full text-wrap">{wordWrap(chat.message, 150)}</p>
              <span className="text-gray-700 text-right text-xs">{chat.createdAt.toString().slice(0, 24)}</span>
            </div>
          ))
        }
        {
          inbox.map((msg: string, i: number) => (
            <div key={i} id="chat" className="carousel-item mb-2 bg-blue-300 w-fit px-4 py-2 text-gray-900 flex-col">
              <p className="max-w-full text-wrap">{wordWrap(msg, 150)}</p>
              <span className="text-gray-700 text-right text-xs">
                {
                  (new Date().getTime() - time[i]) < 1000 * 60 ?
                    (new Date().getTime() - time[i]) < 1000 * 30 ? "Now" : ((new Date().getTime() - time[i]) / 1000).toString().slice(0, 3) + " sec"
                    : ((new Date().getTime() - time[i]) / 60000).toString().split(".")[0] + " min"}
              </span>
            </div>
          ))
        }


      </div>

      <form onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSendHandler(text)
      }} >
        <label className="textarea  flex items-center gap-2 static  
        w-full
        bottom-5">
          <textarea
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setText(e.target.value) }}
            className="grow resize-none p-1 text-lg" placeholder="Message..." />
          <button type="submit">
            <IoSend className="hover:cursor-pointer hover:scale-110" />
          </button>
        </label>
      </form>
    </main>
  );
}
