
import { io } from "socket.io-client"
import { useState, useEffect } from "react";
const socket = io.connect("http://localhost:3001");

const Leaderboard = () => {
  const [input,setInput] = useState([]) 
  const [msg,setMsg] = useState([])

  useEffect(() => {
    socket.on("send_message", msg => {
      setMsg(currentMsg => [...currentMsg, msg])
    })

  }, [])
  
  const sendMessage = () => {
    socket.emit("send_message",input);
    setInput("")

  }

  return(
<div className="cbox">
  <div className="msgbox">
  {msg.map((x,index) =>
      (<div className="sentMessages" key = {index}>{`${x}`} </div>
    ))
  }</div>
  <input value={input} onChange={(event) => {setInput(event.target.value)}} placeholder="Message..."/>
  <button onClick={sendMessage}>Send Message</button>
</div>
   



  




);

};

export default Leaderboard