
import { io } from "socket.io-client"
import { useState, useEffect } from "react";

const socket = io.connect("http://localhost:3001");

const Leaderboard = () => {
  const [messageReceived,setMessageReceived] = useState([]) 
  const [message,setMessage] = useState("")
  
  
  const sendMessage = () => {
    socket.emit("send_message",{ message });
    setMessageReceived((prevMessage) => [...prevMessage, message]);
    
    setMessage("")
  };
 
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      
      setMessageReceived((prevMessage) => [...prevMessage, data.message]);
    
    });

  }, [socket]);

  return(
  <section>
    <div className="cbox">

  <div className="msgbutton">
 
  
  <input value={ message }placeholder="Message..." onChange={(event) => {setMessage(event.target.value)}}/>
  <button onClick={sendMessage}>Send Message</button>
  </div>
  <div className="msgbox">

  <h2>Message:</h2>

  
    <div className="msg">
  {messageReceived.map((msg, index) => (
    <div key={index}>{msg}</div>
  ))}
  </div>



    </div>
 </div>
     </section>

   



  




);

};

export default Leaderboard