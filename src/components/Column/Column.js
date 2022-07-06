import Task from "components/Task/Task";
import React from "react";
import "./column.scss";

const Column = () => {
  return (
    <div className="column">
      <header>Brainstorm</header>
      <ul className="task-list">
        <Task />
        <li className="task-item">Add what you'd like to word on below</li>
        <li className="task-item">Add what you'd like to word on below</li>
        <li className="task-item">Add what you'd like to word on below</li>
        <li className="task-item">Add what you'd like to word on below</li>
      </ul>
      <footer>Add another </footer>
    </div>
  );
};

export default Column;
