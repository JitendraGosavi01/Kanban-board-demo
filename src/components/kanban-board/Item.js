import React from "react";

function Item({ task, index, i, moveBack, moveNext, deleteTask }) {
  return (
    <li className="slide-up-fade-in" key={`${i}${index}`}>
      <div className="li-content layout-row justify-content-between align-items-center">
        <span data-testid={`${task.name.split(" ").join("-")}-name`}>
          {task.name}
        </span>
        <div className="icons">
          <button
            disabled={i === 0}
            className="icon-only x-small mx-2"
            onClick={() => moveBack(task.name, i)}
            data-testid={`${task.name.split(" ").join("-")}-back`}
          >
            <i className="material-icons">arrow_back</i>
          </button>
          <button
            disabled={i === 3}
            className="icon-only x-small mx-2"
            onClick={() => moveNext(task.name, i)}
            data-testid={`${task.name.split(" ").join("-")}-forward`}
          >
            <i className="material-icons">arrow_forward</i>
          </button>
          <button
            className="icon-only danger x-small mx-2"
            onClick={() => deleteTask(task.name)}
            data-testid={`${task.name.split(" ").join("-")}-delete`}
          >
            <i className="material-icons">delete</i>
          </button>
        </div>
      </div>
    </li>
  );
}

export default Item;
