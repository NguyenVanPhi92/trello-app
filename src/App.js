import React from "react";
import ReactDOM from "react-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      {React.version} + {ReactDOM.version}
    </div>
  );
}

export default App;
