
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
      <div className="msgbox">
        <h2 id='MessagesTitle'>Messages</h2>  
          <div className="allMessages">
            <ul className="theList">
            {messageReceived.map((msg, index) => (
              <li className='singleMsg' key={index}>{`UserName Here: ${msg}`}</li>
            ))}
            </ul>
          </div>
      </div>
      <div className="msgbutton">  
        <input id='msgInput' value={ message } placeholder="Message..." onChange={(event) => {setMessage(event.target.value)}}/>
        <button onClick={sendMessage}>Send Message</button>
      </div>
  </section>


   


  




);

};

export default Leaderboard