// Function Set Value To Local Storage
function setValueToStorage(key, value) {
  const toString = JSON.stringify(value);
  return window.localStorage.setItem(key, toString);
}
// Function Get Itime From local Storage
function getValueFromStorag(key) {
  const item = window.localStorage.getItem(key);
  return JSON.parse(item);
}
function getStorage($key) {
  let item;
  if (window.localStorage.getItem($key)) {
    item = JSON.parse(window.localStorage.getItem($key));
  }
  return item;
}

// Start Reset Function
const resetApp = document.querySelector(".reset-app-box");
resetApp.addEventListener("click", () => {
  window.localStorage.clear();
  window.location.reload();
});

const $formBox = document.querySelector(".form-box");
const $userName = document.getElementById("user-name");
const $nameAdd = document.getElementById("name-add");
const $message = document.querySelector(".message-box");
const $nameValue = document.querySelector(".nameU");
const $notifiction = document.querySelector(".audio");
const $alertBox = document.querySelector(".alert-box");
let $soundCount = 0;

$nameAdd.addEventListener("click", () => {
  if ($userName.value !== "") {
    $nameValue.textContent = $userName.value;
    $message.classList.remove("hiddeng");
    $formBox.remove();
    // Local Storage
    const classes = {
      display: "none",
      userName: $userName.value,
      messagebox: "message-box",
    };

    const keyObj = Object.entries(classes);
    for (const [key, val] of keyObj) {
      setValueToStorage(key, val);
    }
  } else {
    $alertBox.classList.add("active");
    alertBox();
  }
});

function alertBox() {
  $soundCount++;
  if ($soundCount < 2) {
    $notifiction.play();
  } else {
    $notifiction.muted = true;
  }

  const action = setTimeout(() => {
    $alertBox.classList.remove("active");
    $soundCount = 0;
  }, 4000);

  $userName.onfocus = function () {
    clearTimeout(action);
    $alertBox.classList.remove("active");
    $soundCount = 0;
  };
}

if (window.localStorage.getItem("display")) {
  $formBox.style.display = getValueFromStorag("display");
  $nameValue.textContent = getValueFromStorag("userName");
  $message.className = getValueFromStorag("messagebox");
}

/*  ------------------- New Tsks Craeted -------------------  */

function setStorage($key, $value) {
  const $SendData = window.localStorage.setItem($key, JSON.stringify($value));
  return $SendData;
}

function getStorage($key) {
  let item;
  if (window.localStorage.getItem($key)) {
    item = JSON.parse(window.localStorage.getItem($key));
  }
  return item;
}

// function create The Task
const $task_input = document.getElementById("add-task-input");
const $submit_task = document.getElementById("submit-task");
let $task_data = [];
const $tasks_area = document.querySelector(".tasks-area");
const counter = document.querySelector(".counter");

// Run tasks directly from stored data, if any
if (getStorage("tasks")) {
  $task_data = getStorage("tasks");
  craeteNewTask(getStorage("tasks"));
}

// Launcher Main Function
$submit_task.addEventListener("click", function () {
  if ($task_input.value !== "") {
    // Craete New Task
    setDataToArray($task_input.value);
    $task_input.value = "";
    // Craete Tasks
    craeteNewTask($task_data);
  }
});

// Send Data To Empty Array
function setDataToArray(data) {
  const taskInformation = {
    id: Date.now(),
    title: data,
    done: false,
    delete: false,
    all_tasks: false,
    completed_tasks: false,
    unfinished_tasks: false,
    delete_finished_tasks: false,
    end_unfinished_tasks: false,
    delete_all_tasks: false,
  };
  $task_data.push(taskInformation);
  // Data send to local storage
  setStorage("tasks", $task_data);
}

// Craete Task Div
function craeteNewTask(data) {
  $tasks_area.innerHTML = "";
  data.forEach((task) => {
    const task_div = document.createElement("div");
    task_div.className = "task";
    task_div.setAttribute("id", task.id);

    if (task.delete === true) {
      task_div.remove();
    }

    if (task.done === true) {
      task_div.classList.add("done-task");
    }

    // Date
    const createTime = task.id;
    const getDate = new Date(createTime);
    const fullDate = getDate.toLocaleString();
    const dateBox_div = document.createElement("div");
    dateBox_div.className = "date-box";
    dateBox_div.textContent = `${fullDate}`;

    const taskContent_div = document.createElement("div");
    taskContent_div.className = "task-content";
    const taskTextBox_div = document.createElement("div");
    taskTextBox_div.className = "task-text-box";
    const span_Element = document.createElement("span");
    span_Element.textContent = task.title;
    const taskControlBox_div = document.createElement("div");
    taskControlBox_div.className = "task-control-box";
    const done_div = document.createElement("div");
    done_div.className = "done";

    const doneIcon_span = document.createElement("span");
    doneIcon_span.className = "list-icon";
    doneIcon_span.innerHTML = `<i class="fa-solid fa-check"></i>`;
    const delete_div = document.createElement("div");
    delete_div.className = "delete";
    const deleteIcon_span = document.createElement("span");
    deleteIcon_span.className = "list-icon";
    deleteIcon_span.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    // Appen Elements
    $tasks_area.appendChild(task_div);
    task_div.appendChild(dateBox_div);
    task_div.appendChild(taskContent_div);
    taskContent_div.appendChild(taskTextBox_div);
    taskTextBox_div.appendChild(span_Element);
    taskContent_div.appendChild(taskControlBox_div);
    taskControlBox_div.appendChild(done_div);
    done_div.appendChild(doneIcon_span);
    taskControlBox_div.appendChild(delete_div);
    delete_div.appendChild(deleteIcon_span);
  });
  doneButton(data);
  deleteButton(data);
  showAllTasks();
  completedTasks();
  unfinishedTasks();
  deleteFinishedTasks($task_data);
  endUnfinishedTasks($task_data);
  deleteAllTasks($task_data);
  tasksCounter();
}

// Tasks Counter
function tasksCounter() {
  counter.textContent = getStorage("tasks").length;
}

// Done Function
function doneButton(tasksData) {
  const doneBTN = document.querySelectorAll(".done");
  let htmlTaskId;
  doneBTN.forEach((button) => {
    button.addEventListener("click", (e) => {
      // if (button.parentElement) {
      htmlTaskId = Number(
        button.parentElement.parentElement.parentElement.getAttribute("id")
      );
      // }
      // Edite Data From Local Storag
      tasksData.forEach((task) => {
        if (task.id === htmlTaskId) {
          if (task.done === false) {
            task.done = true;
          } else if (task.done === true) {
            task.done = false;
          }
        }
      });
      setStorage("tasks", tasksData);
      craeteNewTask(tasksData);
    });
  });
}

// Delete Function
function deleteButton(tasksData) {
  const deleteBTN = document.querySelectorAll(".delete");
  let htmlTaskId;
  deleteBTN.forEach((button) => {
    button.addEventListener("click", () => {
      htmlTaskId = Number(
        button.parentElement.parentElement.parentElement.getAttribute("id")
      );
      // Tasks Lopping
      tasksData = tasksData.filter((task) => task.id != htmlTaskId);
      setStorage("tasks", tasksData);
      craeteNewTask(tasksData);
    });
  });
}

// Show All Tasks
function showAllTasks() {
  const allTasks = document.querySelector(".all-tasks");
  const $taskNote = document.querySelectorAll(".task");
  allTasks.addEventListener("click", () => {
    $taskNote.forEach((task) => (task.style.display = "flex"));
  });
}

// Show Completed Tasks
function completedTasks() {
  const completedTasks = document.querySelector(".completed-tasks");
  const $taskNote = document.querySelectorAll(".task");
  let styleSatus = false;
  completedTasks.addEventListener("click", () => {
    if (styleSatus === false) {
      styleSatus = true;
    } else if (styleSatus === true) {
      styleSatus = false;
    }
    // console.log(styleSatus);
    if (styleSatus === true) {
      $taskNote.forEach((task) => {
        if (task.classList.contains("done-task")) {
          task.style.display = "flex";
        } else if (!task.classList.contains("done-task")) {
          task.style.display = "none";
        }
      });
    } else if (styleSatus === false) {
      $taskNote.forEach((task) => {
        task.style.display = "flex";
      });
    }
    console.log(styleSatus);
  });
}

// Show unfinished Tasks
function unfinishedTasks() {
  const unfinishedTasks = document.querySelector(".unfinished-tasks");
  const $taskNote = document.querySelectorAll(".task");
  let styleSatus = false;
  unfinishedTasks.addEventListener("click", () => {
    $taskNote.forEach((task) => (task.style.display = "flex"));
    if (styleSatus === false) {
      styleSatus = true;
    } else if (styleSatus === true) {
      styleSatus = false;
    }
    // console.log(styleSatus);
    if (styleSatus === true) {
      $taskNote.forEach((task) => {
        if (task.classList.contains("done-task")) {
          task.style.display = "none";
        } else if (!task.classList.contains("done-task")) {
          task.style.display = "flex";
        }
      });
    } else if (styleSatus === false) {
      $taskNote.forEach((task) => {
        task.style.display = "flex";
      });
    }
    console.log(styleSatus);
  });
}

// Delete finished tasks
function deleteFinishedTasks(tasksData) {
  const deleteFinishedTasks = document.querySelector(".delete-finished-tasks");
  deleteFinishedTasks.addEventListener("click", () => {
    tasksData = tasksData.filter((task) => task.done === false);
    setStorage("tasks", tasksData);
    craeteNewTask(tasksData);
  });
}

// end unfinished tasks
function endUnfinishedTasks(tasksData) {
  const endUnfinishedTasks = document.querySelector(".end-unfinished-tasks");
  endUnfinishedTasks.addEventListener("click", () => {
    tasksData.forEach((task) => {
      task.done = true;
    });
    setStorage("tasks", tasksData);
    craeteNewTask(tasksData);
  });
}

// delete all tasks
function deleteAllTasks(tasksData) {
  const deleteAllTasks = document.querySelector(".delete-all-tasks");
  deleteAllTasks.addEventListener("click", () => {
    // window.localStorage.clear();
    tasksData = [];
    setStorage("tasks", tasksData);
    craeteNewTask(tasksData);
  });
}
