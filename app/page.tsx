"use client"
import { FormEvent, useState } from "react";
import jwt from 'jsonwebtoken'

export default function Home() {
  return (
    <div className="fixed flex w-full h-full top-0 gap-[1em] left-0 p-[1em]">
      <AppMessage text="No Encryption" elType="noauth" />
      <AppMessage text="With Encryption" elType="auth" />
    </div>
  );
}

const AppMessage = ({ text, elType }: TElAppMessage) => {
  const [message, setMessage] = useState('')
  const [listMessage, setListMessage] = useState<string[]>([])

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault()
    setListMessage(prev => [...prev, message])
    // send message to server and get feedback
    let prepareMessage = message
    if (elType == 'auth') {
      // encrypt pesan
      let encrypted = jwt.sign(message, 'k3y3ncr1pt10n')
      prepareMessage = encrypted
    }
    const action = await fetch("/api/message", {
      method: 'POST',
      body: JSON.stringify({
        message: prepareMessage,
        type: elType,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await action.json()
    // decrypt pesan dari server jika auth
    if (elType == 'auth') {
      let decryptedMessage: any = jwt.verify(response.message, 'k3y3ncr1pt10n')
      setListMessage(prev => [...prev, decryptedMessage])
    } else {
      setListMessage(prev => [...prev, response.message])
    }
    setMessage('')
  }

  return (
    <div className="bg-[#f2f2f2] h-[70%] rounded-[0.5em] flex-1 p-[0.5em]">
      <div className="h-[90%] p-[0.5em] overflow-auto">
        {
          listMessage.map((message, index) => (
            <p
              key={index}
              className={`w-full bg-white mb-[0.5em] rounded-[0.5em] p-[0.5em] ${index % 2 != 0 ? '' : 'text-right bg-[#C5DFF8]'}`}
            >{message}</p>
          ))
        }
      </div>
      <form className=" flex gap-[1em]" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="flex-1 outline outline-[0.05em] rounded-[0.5em] outline-[#ddd] p-[0.75em]"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message ..."
        />
        <button
          className="bg-[#068FFF] text-white p-[0.75em] rounded-[0.5em]"
        >Kirim</button>
      </form>
      <div className={`${text == 'No Encryption' ? 'text-[#F45050]' : 'text-[#1B9C85]'}  mt-[1em] text-center rounded-[0.5em] text-[1.5em] font-semibold`}>
        {text}
      </div>
    </div>
  )
}


type TElAppMessage = {
  text: string;
  elType: string;
}