import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [myText, setMyText] = useState()
  const [ws, setWs] = useState()
  const [log, setLog] = useState([])
  function sendMessageToServer() {
    ws.send("Hello from button!");
  }
  useEffect(() => {
    console.log("Using effect")
    let ws = new WebSocket('ws://localhost:3001/')
    console.log(ws)
    ws.onopen = () => {
      console.log("connected")
      ws.send("Hello from the client!");
    }
    ws.onmessage = evt => {
      console.log("Server sent me this: " + evt.data)
      let newObj = JSON.parse(evt.data.toString());
      console.log(newObj)
      setLog((prevLog) => [...prevLog, newObj])
    }
    setWs(ws)
  }, [])
  useEffect(() => {
    const getData = async () => {
      // You need to restrict it at some point
      // This is just dummy code and should be replaced by actual
      let result = await fetch("http://localhost:3001/data").then(value => value.text())
      console.log(result)
      setMyText(result)
      }
    getData()
  }, [])
  let logEntries = log.map((item) => <p>{item.data}</p>)
  return (
    <div className="App">
        <p>
          {myText == null ? "Loading " : myText}
      </p>
      <button onClick={sendMessageToServer}>Click me!</button>
      {logEntries}
    </div>
  );
}

export default App;
