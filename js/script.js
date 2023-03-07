/**
 * [
 *    {
 *      id: <int>
 *      task: <string>
 *      timestamp: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */
const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function makeTodo(todoObject) {
  const { id, task, timestamp, isCompleted } = todoObject;

  const new_timestamp = timestamp.split("T");

  const textTitle = document.createElement("h2");
  textTitle.innerText = task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = `${new_timestamp[0]}/ `;

  const textTime = document.createElement("p");
  textTime.innerText = new_timestamp[1];

  const paragrafContainer = document.createElement("div");
  paragrafContainer.classList.add("paragraf");
  paragrafContainer.append(textTimestamp, textTime);

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, paragrafContainer);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      alert("Anda mengulang kegiatan ini");
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      alert("Anda menghapus kegiatan ini");
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      alert("Yey anda sudah menyelesaikan kegiatan ini!");
      addTaskToCompleted(id);
    });

    container.append(checkButton);
  }
  return container;
}

function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );
  todos.push(todoObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm /* HTMLFormElement */ = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    alert("Anda menambahkan kegiatan baru");
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("todos");
  const listCompleted = document.getElementById("completed-todos");

  // clearing list item
  uncompletedTODOList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});




// countdown
// var input = document.getElementById("date");
// console.log(input.value)
// var countdown = document.getElementById("countdown");


// var x = setInterval(function() {

//     var countDownDate = new Date(input.value).getTime();
//     console.log(countDownDate)

//     var now = new Date().getTime();

//     var distance = countDownDate - now;

//     // Calculate days, hours, minutes and seconds left
//     var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//     // Display the result in the countdown element
//     countdown.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

//     // If the countdown is over, show "EXPIRED" message
//     if (distance < 0) {
//         clearInterval(x);
//         countdown.innerHTML = "EXPIRED";
//     }
// }, 1000);