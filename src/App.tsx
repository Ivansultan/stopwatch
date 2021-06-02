import React, { useState, useRef } from "react";
import { fromEvent } from "rxjs";
import { map, buffer, filter, debounceTime } from "rxjs/operators";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(false);
  const [wait, setWait] = useState(false);

  const intervalId = useRef<any>(null);

  const click$ = fromEvent(document, "click");

  const doubleClick$ = click$.pipe(
    buffer(click$.pipe(debounceTime(300))),
    map((clicks) => clicks.length),
    filter((clicksLength) => clicksLength === 2)
  );

  doubleClick$.subscribe((_) => {
    setStart(false);
    clearInterval(intervalId.current);
  });

  const startAndStop = () => {
    if (!start) {
      setWait(true);
      setStart(true);
      intervalId.current = setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }

    if (start) {
      setStart(!true);
      setCount(0);
      clearInterval(intervalId.current);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const getSeconds = `0${count % 60}`.slice(-2);
  const minutes: any = `${Math.floor(count / 60)}`;
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(count / 3600)}`.slice(-2);

  return (
    <div className="App">
      <div className="screen">
        <div className="hours">{getHours} :</div>
        <div className="minutes">{getMinutes} :</div>
        <div className="seconds">{getSeconds}</div>
      </div>
      <div className="buttons">
        <div className="button">
          <button onClick={startAndStop}>{start ? "Stop" : "Start"}</button>
        </div>
        <div className="button">
          <button>Wait</button>
        </div>
        <div className="button">
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
