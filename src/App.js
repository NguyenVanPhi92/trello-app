import AppBar from "components/AppBar/AppBar";
import BoardContent from "components/BoadContent/BoardContent";
import BoardBar from "components/BoardBar/BoardBar";
import React from "react";
import "./App.scss";

function App() {
  return (
    <div className="trello-trungquandev-master">
      <AppBar />
      <BoardBar />
      <BoardContent />
    </div>
  );
}

export default App;
