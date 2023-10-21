import { useState } from "react";
import './App.css';
import {useRequestState, setStateForDebug, logState, logListeners} from "./request-utils";

const key = "one";

const CompA = () => {
  console.log("RENDER AAA");
  const {isLoading} = useRequestState(key);

  return (
    <div>
      <h2>Hello A</h2>
      <p><button onClick={() => setStateForDebug("loaders", key, true)}>Add Loader</button></p>
      <p><button onClick={() => setStateForDebug("loaders", key, false)}>Remove Loader</button></p>
      <br/><br/>
      <div>{isLoading && <p>Loading...</p>}</div>
    </div>
  );
};

const CompB = () => {
  console.log("RENDER BBB");
  const {error, hasError} = useRequestState(key);

  return (
    <div>
      <h2>Hello B</h2>
      <p><button onClick={() => setStateForDebug("errors", key, { status: 500 })}>Add Error</button></p>
      <p><button onClick={() => setStateForDebug("errors", key, null)}>Remove Error</button></p>
      <br/><br/>
      <div>{hasError && <p>Error status: {error?.status}</p>}</div>
    </div>
  );
};

const CompC = () => {
  console.log("RENDER CCC");
  const {hasError} = useRequestState(key);

  return (
    <div>
      <h2>Hello C</h2>
      <div>{hasError && <p>Error !!!</p>}</div>
    </div>
  );
};

function App() {
  const [aVisible, setAVisibility] = useState(true);
  const [bVisible, setBVisibility] = useState(true);
  const [cVisible, setCVisibility] = useState(true);

  const toggleA = () => setAVisibility(prev => !prev);
  const toggleB = () => setBVisibility(prev => !prev);
  const toggleC = () => setCVisibility(prev => !prev);

  const setFulfilled = () => setStateForDebug("fulfilled", key, true);

  return (
    <main>
      <p><button onClick={toggleA}>Toggle A</button></p>
      <p><button onClick={toggleB}>Toggle B</button></p>
      <p><button onClick={toggleC}>Toggle C</button></p>
      <br/><br/>
      <p>
        <button onClick={() => logState()}>Get State</button>
        <br/>
        <button onClick={() => logListeners()}>Get Listeners</button>
      </p>
      <p>
        <button onClick={setFulfilled}>Set fulfilled</button>
      </p>
      <br/><br/>
      {aVisible && <CompA />}
      <br/><br/>
      {bVisible && <CompB />}
      <br/><br/>
      {cVisible && <CompC />}
    </main>
  )
}

export default App
