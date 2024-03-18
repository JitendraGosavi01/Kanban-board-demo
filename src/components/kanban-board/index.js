import React, { useState, useEffect } from "react";
import "./index.css";

const STAGE_NAMES = ["Backlog", "To Do", "Ongoing", "Done"];
export default function KanbanBoard(props) {
  let [tasks, setTasks] = React.useState([
    { name: "1", stage: 0 },
    { name: "2", stage: 0 },
  ]);

  const [task, setTask] = useState(null);
  const [dropStage, setDropStage] = useState(null);
  const [isDropOver, setIsDropOver] = useState(false);
  let stagesTasks = STAGE_NAMES.map((ele) => []);

  for (let task of tasks) {
    const stageId = task.stage;
    stagesTasks[stageId]?.push(task);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task) {
      setTasks((prev) => [...prev, { name: task, stage: 0 }]);
    }
  };

  useEffect(() => {
    setTask("");
  }, [tasks]);

  const moveBack = (task, currentStage) => {
    const [itemToMoveBack, index] = getItemAndIndex(tasks, task);
    setTasks(removeElement(tasks, index));
    itemToMoveBack.stage = currentStage - 1;
    setTasks((prev) => [...prev, itemToMoveBack]);
  };

  const moveNext = (task, currentStage) => {
    const [itemToMoveNext, index] = getItemAndIndex(tasks, task);
    setTasks(removeElement(tasks, index));
    itemToMoveNext.stage = currentStage + 1;
    setTasks((prev) => [...prev, itemToMoveNext]);
  };

  const deleteTask = (task) => {
    const index = tasks.findIndex((ele) => ele.name === task);
    setTask(tasks.splice(index, 1));
  };

  const handleOnDrag = (event, task) => {
    setIsDropOver(false);
    event.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  const handleOnDrop = (event, taskStage) => {
    event.preventDefault();
    setDropStage(taskStage);
    setIsDropOver(true);
    const task = JSON.parse(event.dataTransfer.getData("text/plain"));
    const [itemToMoveNext, index] = getItemAndIndex(tasks, task.name);
    setTasks(removeElement(tasks, index));
    itemToMoveNext.stage = taskStage;
    setTasks((prev) => [...prev, itemToMoveNext]);
    setDropStage(null);
  };

  const handleOnDragOver = (event, taskStage) => {
    event.preventDefault();
    setDropStage(taskStage);
    setIsDropOver(true);
  };

  return (
    <div className="mt-20 layout-column justify-content-center align-items-center">
      <section className="mt-50 layout-row align-items-center justify-content-center">
        <form action="" onSubmit={handleSubmit}>
          <input
            id="create-task-input"
            type="text"
            className="large"
            placeholder="New task name"
            data-testid="create-task-input"
            onChange={(e) => setTask(e.target.value)}
            value={task}
          />
          <button
            type="submit"
            className="ml-30"
            data-testid="create-task-button"
          >
            Create task
          </button>
        </form>
      </section>

      <div className="mt-50 layout-row">
        {stagesTasks.map((tasks, i) => {
          return (
            <div className="card outlined ml-20 mt-0" key={`${i}`}>
              <div
                className="card-text"
                onDrop={(e) => handleOnDrop(e, i)}
                onDragOver={(e) => handleOnDragOver(e, i)}
                style={
                  isDropOver && dropStage === i
                    ? {
                        border: "2px purple",
                        padding: "20px",
                        margin: "20px",
                        background: "#9195f6",
                        borderRadius: "5px",
                      }
                    : {}
                }
              >
                <h4>{STAGE_NAMES[i]}</h4>
                <ul className="styled mt-50" data-testid={`stage-${i}`}>
                  {tasks.map((task, index) => {
                    return (
                      <li className="slide-up-fade-in" key={`${i}${index}`}>
                        <div
                          className="li-content layout-row justify-content-between align-items-center"
                          draggable
                          onDragStart={(e) => handleOnDrag(e, task)}
                        >
                          <span
                            data-testid={`${task.name
                              .split(" ")
                              .join("-")}-name`}
                          >
                            {task.name}
                          </span>
                          <div className="icons">
                            <button
                              disabled={i === 0}
                              className="icon-only x-small mx-2"
                              onClick={() => moveBack(task.name, i)}
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-back`}
                            >
                              <i className="material-icons">arrow_back</i>
                            </button>
                            <button
                              disabled={i === 3}
                              className="icon-only x-small mx-2"
                              onClick={() => moveNext(task.name, i)}
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-forward`}
                            >
                              <i className="material-icons">arrow_forward</i>
                            </button>
                            <button
                              className="icon-only danger x-small mx-2"
                              onClick={() => deleteTask(task.name)}
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-delete`}
                            >
                              <i className="material-icons">delete</i>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const getItemAndIndex = (array, elementToVerify) => {
  const item = array.find((ele) => ele.name === elementToVerify);
  const index = array.findIndex((ele) => ele.name === elementToVerify);
  return [item, index];
};

const removeElement = (array, index) => {
  //"""Removes the first occurrence of element from the array and returns the left array."""
  return array.slice(0, index).concat(array.slice(index + 1));
};
