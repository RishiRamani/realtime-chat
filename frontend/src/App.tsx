import { useEffect, useState, useRef } from 'react'
import './App.css'
import { socket } from './socket/socket'
import type { Message } from './types/message';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,setInput] = useState<string>("");
  const [username] = useState(()=>{
    const randomNumber = Math.floor(Math.random()*1000);

    return `User-${randomNumber}`
  });
  const [typingUsers,setTypingUsers] = useState<string[]>([])
  const isTypingRef = useRef(false);


  useEffect(()=>{
    if(input.trim() === "")
    {
      if(isTypingRef.current)
      {
        socket.emit("typing-stop",{
          username
        });

        isTypingRef.current = false;
      }

      return;
    }

    if(!isTypingRef.current)
    {
      socket.emit("typing-start",{
        username
      });

      isTypingRef.current = true;
    }

    const timer = setTimeout(()=>{

      socket.emit("typing-stop",{
        username
      });

      isTypingRef.current = false;

    },3000);

    return ()=>{

      clearTimeout(timer);

    };

  },[input,username]);

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("Connected to server",socket.id);
      socket.emit("join",{
        username:username
      });
      
    });

    socket.on("reply",handleReply);
    socket.on("typing-yes",handleStartTyping);
    socket.on("typing-no",handleStopTyping);

    return ()=>{
      socket.off("connect");
      socket.off("reply",handleReply)
      socket.off("typing-yes",handleStartTyping)
      socket.off("typing-no",handleStopTyping)
    }
  },[]);

  function sendMessage(input:string,username:string){
    socket.emit("message",{
      username:username,
      message:input
    });
    setInput("");
  }
  
  function handleReply(message:Message){
    setMessages((prevMessages)=>{
      return [...prevMessages,message]
    });
  }

  function handleStartTyping(username:{username:string}){
    setTypingUsers((prev)=>{
      if(prev.includes(username.username)){
        return prev;
      }
      return [...prev,username.username];
    })
  }

  function handleStopTyping(username:{username:string}){
    setTypingUsers((prev)=>{
      return prev.filter((i)=>{
        return i!==username.username
      })
    })
  }

  return (<>
    <div className='flex flex-col gap-10'>
      <h1 className='text-2xl font-bold'>Realtime Msging</h1>
      {messages.map((message)=>{
        if(message.type==="join"){
          return (<div key={message.id}>
            {message.text} joined the chat
          </div>)
        }else if(message.type==="leave"){
          return(
            <div key={message.id}>{message.text} left the chat</div>
          )
        }else{
          return (
          <div key={message.id}>
            <div>
              {message.username}
            </div>
            <div>
              {message.id}
            </div>
            <div>
              {message.text}
            </div>
            <div>
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
            
          </div>);
        }
        
      })}
      {typingUsers.length>0&&<div className='flex'>
        {typingUsers.map((i)=>{
          return (<div key={i}>{i},</div>)
        })}
        <div>are typing...</div>
      </div>}
      <input value={input} onChange={(e)=>{
        const value = e.target.value;
        setInput(value)
        
        }} className='border-1 p-4' placeholder='Message...'/>
      <button className='p-2 bg-green-500 self-center' onClick={()=>{
        if(input===""){
          return;
        }
        sendMessage(input,username)
        }}>Send</button>
    </div>
  </>);
}

export default App
