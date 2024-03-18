import React from "react";
import "./App.css";
import "h8k-components";
import Header from "./Header";
import KanbanBoard from "./components/kanban-board";

const App = () => {
  return (
    <div className="App">
      <Header title="Kanban Board" />
      <KanbanBoard />
    </div>
  );
};

export default App;
