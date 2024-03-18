import React from "react";
import App from "./App";
import { render, fireEvent, cleanup, screen } from "@testing-library/react";

import "@testing-library/jest-dom/extend-expect";

const renderApp = () => render(<App />);

afterEach(() => {
  cleanup();
});

// elements in App by data-testids
const testIds = {
  createTaskInput: "create-task-input",
  createTaskButton: "create-task-button",
  moveBackButton: "move-back-button",
  moveForwardButton: "move-forward-button",
  deleteButton: "delete-button",
  stages: ["stage-0", "stage-1", "stage-2", "stage-3"],
};

test("Clicking on Create Task Button should add it to first stage and do nothing if input is empty", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const backlogStage = screen.queryByTestId(testIds.stages[0]);
  const toDoStage = screen.queryByTestId(testIds.stages[1]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  fireEvent.click(createTaskButton);
  expect(backlogStage).toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(createTaskInput.value).toBeFalsy();

  const initialLength = backlogStage.children.length;
  fireEvent.change(createTaskInput, {
    target: { value: "" },
  });
  fireEvent.click(createTaskButton);

  expect(backlogStage.children.length).toBe(initialLength);
});

test("For a task in stage 0, backward icon is disabled and forward icon is enabled", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const backlogStage = screen.queryByTestId(testIds.stages[0]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskBackIconId = `${taskName.split(" ").join("-")}-back`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  expect(backlogStage).toContainElement(screen.queryByTestId(taskId));
  expect(screen.queryByTestId(taskBackIconId).hasAttribute("disabled")).toBe(
    true
  );
  expect(
    screen.queryByTestId(taskForwardIconId).hasAttribute("disabled")
  ).toBeFalsy();
});

test("For a task in stage 0, can be moved forward till stage 4 and check for icons are enabled/disabled correctly", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const backlogStage = screen.queryByTestId(testIds.stages[0]);
  const toDoStage = screen.queryByTestId(testIds.stages[1]);
  const onGoingStage = screen.queryByTestId(testIds.stages[2]);
  const doneStage = screen.queryByTestId(testIds.stages[3]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskBackIconId = `${taskName.split(" ").join("-")}-back`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  expect(backlogStage).toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));

  fireEvent.click(screen.queryByTestId(taskForwardIconId));

  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(
    screen.queryByTestId(taskBackIconId).hasAttribute("disabled")
  ).toBeFalsy();
  expect(
    screen.queryByTestId(taskForwardIconId).hasAttribute("disabled")
  ).toBeFalsy();

  fireEvent.click(screen.queryByTestId(taskForwardIconId));

  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(
    screen.queryByTestId(taskBackIconId).hasAttribute("disabled")
  ).toBeFalsy();
  expect(
    screen.queryByTestId(taskForwardIconId).hasAttribute("disabled")
  ).toBeFalsy();

  fireEvent.click(screen.queryByTestId(taskForwardIconId));
  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).toContainElement(screen.queryByTestId(taskId));

  expect(
    screen.queryByTestId(taskBackIconId).hasAttribute("disabled")
  ).toBeFalsy();
  expect(screen.queryByTestId(taskForwardIconId).hasAttribute("disabled")).toBe(
    true
  );
});

test("For a task in stage 4, can be moved backward till stage 0 and check for icons are enabled/disabled correctly", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const backlogStage = screen.queryByTestId(testIds.stages[0]);
  const toDoStage = screen.queryByTestId(testIds.stages[1]);
  const onGoingStage = screen.queryByTestId(testIds.stages[2]);
  const doneStage = screen.queryByTestId(testIds.stages[3]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskBackIconId = `${taskName.split(" ").join("-")}-back`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(taskForwardIconId));
  fireEvent.click(screen.queryByTestId(taskForwardIconId));
  fireEvent.click(screen.queryByTestId(taskForwardIconId));

  fireEvent.click(screen.queryByTestId(taskBackIconId));
  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(
    screen.queryByTestId(taskBackIconId).hasAttribute("disabled")
  ).toBeFalsy();
  expect(
    screen.queryByTestId(taskForwardIconId).hasAttribute("disabled")
  ).toBeFalsy();

  fireEvent.click(screen.queryByTestId(taskBackIconId));
  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(
    screen.queryByTestId(taskBackIconId).hasAttribute("disabled")
  ).toBeFalsy();
  expect(
    screen.queryByTestId(taskForwardIconId).hasAttribute("disabled")
  ).toBeFalsy();

  fireEvent.click(screen.queryByTestId(taskBackIconId));
  expect(backlogStage).toContainElement(screen.queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));
  expect(screen.queryByTestId(taskBackIconId).hasAttribute("disabled")).toBe(
    true
  );
  expect(
    screen.queryByTestId(taskForwardIconId).hasAttribute("disabled")
  ).toBeFalsy();
});

test("Clicking on delete should delete the task in stage 0", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const backlogStage = screen.queryByTestId(testIds.stages[0]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);

  expect(backlogStage).toContainElement(screen.queryByTestId(taskId));
  expect(screen.queryByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(
    false
  );
  fireEvent.click(screen.queryByTestId(taskDeleteIconId));
  expect(backlogStage).not.toContainElement(screen.queryByTestId(taskId));
});

test("Clicking on delete should delete the task in stage 1", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const toDoStage = screen.queryByTestId(testIds.stages[1]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(taskForwardIconId));

  expect(toDoStage).toContainElement(screen.queryByTestId(taskId));
  expect(screen.queryByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(
    false
  );
  fireEvent.click(screen.queryByTestId(taskDeleteIconId));
  expect(toDoStage).not.toContainElement(screen.queryByTestId(taskId));
});

test("Clicking on delete should delete the task in stage 2", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const activeStage = screen.queryByTestId(testIds.stages[2]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(taskForwardIconId));
  fireEvent.click(screen.queryByTestId(taskForwardIconId));

  expect(activeStage).toContainElement(screen.queryByTestId(taskId));
  expect(screen.queryByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(
    false
  );
  fireEvent.click(screen.queryByTestId(taskDeleteIconId));
  expect(activeStage).not.toContainElement(screen.queryByTestId(taskId));
});

test("Clicking on delete should delete the task in stage 3", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const doneStage = screen.queryByTestId(testIds.stages[3]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(taskForwardIconId));
  fireEvent.click(screen.queryByTestId(taskForwardIconId));
  fireEvent.click(screen.queryByTestId(taskForwardIconId));

  expect(doneStage).toContainElement(screen.queryByTestId(taskId));
  expect(screen.queryByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(
    false
  );
  fireEvent.click(screen.queryByTestId(taskDeleteIconId));
  expect(doneStage).not.toContainElement(screen.queryByTestId(taskId));
});

test("after many forward and back operations, tasks are in correct state", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const backlogStage = screen.queryByTestId(testIds.stages[0]);
  const toDoStage = screen.queryByTestId(testIds.stages[1]);
  const onGoingStage = screen.queryByTestId(testIds.stages[2]);
  const doneStage = screen.queryByTestId(testIds.stages[3]);

  const backlogInitialLength = backlogStage.children.length;
  const todoInitialLength = toDoStage.children.length;
  const onGoingInitialLength = onGoingStage.children.length;
  const doneInitialLength = doneStage.children.length;

  fireEvent.change(createTaskInput, {
    target: { value: "task 1" },
  });
  fireEvent.click(createTaskButton);

  fireEvent.change(createTaskInput, {
    target: { value: "task 2" },
  });
  fireEvent.click(createTaskButton);

  fireEvent.change(createTaskInput, {
    target: { value: "task 3" },
  });

  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(`task-3-forward`));

  fireEvent.change(createTaskInput, {
    target: { value: "task 4" },
  });
  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(`task-4-forward`));

  fireEvent.change(createTaskInput, {
    target: { value: "task 5" },
  });
  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(`task-5-forward`));
  fireEvent.click(screen.queryByTestId(`task-5-forward`));

  fireEvent.change(createTaskInput, {
    target: { value: "task 6" },
  });
  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(`task-6-forward`));
  fireEvent.click(screen.queryByTestId(`task-6-forward`));

  fireEvent.change(createTaskInput, {
    target: { value: "task 7" },
  });
  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(`task-7-forward`));
  fireEvent.click(screen.queryByTestId(`task-7-forward`));
  fireEvent.click(screen.queryByTestId(`task-7-forward`));

  fireEvent.change(createTaskInput, {
    target: { value: "task 8" },
  });
  fireEvent.click(createTaskButton);
  fireEvent.click(screen.queryByTestId(`task-8-forward`));
  fireEvent.click(screen.queryByTestId(`task-8-forward`));
  fireEvent.click(screen.queryByTestId(`task-8-forward`));

  expect(backlogStage.children.length).toBe(backlogInitialLength + 2);
  expect(backlogStage.contains(screen.queryByTestId("task-1-name"))).toEqual(
    true
  );
  expect(backlogStage.contains(screen.queryByTestId("task-2-name"))).toEqual(
    true
  );
  expect(screen.queryByTestId("task-1-name").innerHTML).toBe("task 1");
  expect(screen.queryByTestId("task-2-name").innerHTML).toBe("task 2");
  expect(toDoStage.children.length).toBe(todoInitialLength + 2);
  expect(toDoStage.contains(screen.queryByTestId("task-3-name"))).toEqual(true);
  expect(toDoStage.contains(screen.queryByTestId("task-4-name"))).toEqual(true);
  expect(screen.queryByTestId("task-3-name").innerHTML).toBe("task 3");
  expect(screen.queryByTestId("task-4-name").innerHTML).toBe("task 4");
  expect(onGoingStage.children.length).toBe(onGoingInitialLength + 2);
  expect(onGoingStage.contains(screen.queryByTestId("task-5-name"))).toEqual(
    true
  );
  expect(onGoingStage.contains(screen.queryByTestId("task-6-name"))).toEqual(
    true
  );
  expect(screen.queryByTestId("task-5-name").innerHTML).toBe("task 5");
  expect(screen.queryByTestId("task-6-name").innerHTML).toBe("task 6");
  expect(doneStage.children.length).toBe(doneInitialLength + 2);
  expect(doneStage.contains(screen.queryByTestId("task-7-name"))).toEqual(true);
  expect(doneStage.contains(screen.queryByTestId("task-8-name"))).toEqual(true);
  expect(screen.queryByTestId("task-7-name").innerHTML).toBe("task 7");
  expect(screen.queryByTestId("task-8-name").innerHTML).toBe("task 8");
});

test("tasks are in correct state after multiple move and deletions", () => {
  renderApp();

  const createTaskInput = screen.queryByTestId(testIds.createTaskInput);
  const createTaskButton = screen.queryByTestId(testIds.createTaskButton);
  const backlogStage = screen.queryByTestId(testIds.stages[0]);
  const onGoingStage = screen.queryByTestId(testIds.stages[2]);

  const backlogInitialLength = backlogStage.children.length;
  const onGoingInitialLength = onGoingStage.children.length;

  fireEvent.change(createTaskInput, {
    target: { value: "task 1" },
  });
  fireEvent.click(createTaskButton);

  fireEvent.change(createTaskInput, {
    target: { value: "task 2" },
  });
  fireEvent.click(createTaskButton);

  fireEvent.click(screen.queryByTestId(`task-1-forward`));
  fireEvent.click(screen.queryByTestId(`task-2-forward`));
  fireEvent.click(screen.queryByTestId(`task-2-forward`));
  fireEvent.click(screen.queryByTestId(`task-1-delete`));

  fireEvent.change(createTaskInput, {
    target: { value: "task 3" },
  });
  fireEvent.click(createTaskButton);

  expect(backlogStage.children.length).toBe(backlogInitialLength + 1);
  expect(backlogStage.contains(screen.queryByTestId("task-3-name"))).toBe(true);
  expect(screen.queryByTestId("task-3-name").innerHTML).toBe("task 3");

  expect(onGoingStage.children.length).toBe(onGoingInitialLength + 1);
  expect(onGoingStage.contains(screen.queryByTestId("task-2-name"))).toBe(true);
  expect(screen.queryByTestId("task-2-name").innerHTML).toBe("task 2");
});
