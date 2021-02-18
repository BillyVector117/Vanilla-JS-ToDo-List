const form = document.getElementById("form");
const input = document.getElementById("input");
const taskList = document.getElementById("task-list");
const template = document.getElementById("template").content; // To access template content
const fragment = document.createDocumentFragment();
let tasks = {
  // console.log(Date.now()) to generate id's
  /* 1610729468930: {
    id: 1610729468930,
    text: "task 1",
    status: false,
  },
  1610729554972: {
    id: 1610729554972,
    text: "task 2",
    status: false,
  }, */
};
// Store documents when page is loading first time
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    storeTasks();
  } else {
    taskList.innerHTML = `
    <div class="alert alert-dark text-center">Any task yet</div>
    `;
    return;
  }
});

taskList.addEventListener("click", (event) => {
  btnAction(event); // Call to btn function
});

// Submit form event
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Input value: ", event.target[0].value);
  setTask(event); // Call 'setTask' function sending the input event
});

// Create/modify 'task' object (database/simulation)
const setTask = (event) => {
  // Validate empty input
  if (event.target[0].value.trim() === "") {
    console.log("Empty value");
    return;
  }
  // Onclick form, create a new Object Task with added values
  const task = {
    id: Date.now(),
    text: event.target[0].value,
    status: false,
  };
  // Set in data collection/database (simulation) the new task created
  tasks[task.id] = task; // The task with id just created, add the value object (this task is new)
  localStorage.setItem("tasks", JSON.stringify(tasks));
  // console.log(tasks); // Store the tasks (re-writing 'tasks' object)

  form.reset();
  input.focus();
  storeTasks(); // Call function to show documents without load the page
};
// Store tasks saved in database/simulation
const storeTasks = () => {
  // let num = 0;
  if (Object.values(tasks).length === 0) {
    taskList.innerHTML = `
    <div class="alert alert-dark text-center">Any task yet</div>
    `;
    return;
  }
  taskList.innerHTML = ""; // to clean before iteration, so will not duplicate elements
  const arrayObject = Object.values(tasks); // Only save 'values' from object 'tasks' (before cloning)
  arrayObject.forEach((object) => {
    // Create and modify the clone elements ('tasks' object)
    // console.log(`Task ${num++}, ${object.text}`);
    const clone = template.cloneNode(true); // To clone this structure element
    clone.querySelector("p").textContent = object.text; // Find <p> element in 'clone' adding 'text' prop. of Each iteration
    // If status's task is true....
    if (object.status) {
      // Select '.alert' element and replace its class warning to primary
      clone
        .querySelector(".alert")
        .classList.replace("alert-warning", "alert-primary");
      clone
        .querySelectorAll(".fas")[0]
        .classList.replace("fa-check-circle", "fa-undo-alt");
      clone.querySelector("p").style.textDecoration = "line-through";
    }
    // Set data.id to all elements with '.fas' class (buttons)/ set 'id' as property to each document
    clone.querySelectorAll(".fas")[0].dataset.id = object.id;
    clone.querySelectorAll(".fas")[1].dataset.id = object.id;

    fragment.appendChild(clone);
  });
  taskList.appendChild(fragment); // the clone is assigned to fragment element for each iteration
};

const btnAction = (event) => {
  // console.log(event.target.classList.contains('fa-check-circle')) // true/false if button is clicked
  // Validate button circle (complete) clicked
  if (event.target.classList.contains("fa-check-circle")) {
    // console.log(event.target.dataset.id) // access to each id's task setted in each button as property

    tasks[event.target.dataset.id].status = true; // task[id].status change to true/false/complete/incompelte
    console.log(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    storeTasks(); // Re-load tasks without load page
  }
  // Validate button circle (delete) clicked
  else if (event.target.classList.contains("fa-minus-circle")) {
    // console.log(event.target.dataset.id) // access to each id's task setted in each button as property
    delete tasks[event.target.dataset.id]; // task[id].status will delete
    localStorage.setItem("tasks", JSON.stringify(tasks));

    storeTasks(); // Re-load tasks without load page
  } else if (event.target.classList.contains("fa-undo-alt")) {
    tasks[event.target.dataset.id].status = false; // task[id].status change to true/false/complete/incompelte
    console.log(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    storeTasks(); // Re-load tasks without load page
  }
  event.stopPropagation(); // Avoid addEvents propagations (only accepts the ones within container)
};
