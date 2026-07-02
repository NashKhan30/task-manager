const form = document.querySelector("form");
const taskContainer = document.querySelector(".task-container");
const submitBtn = document.querySelector("form button");
const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");
const themeBtn = document.querySelector("#themeBtn");

let allTasks = [];

let updateIndex = null;

const updateDashboard = () => {
  const completedTasks = allTasks.filter((task) => {
    return task.completed === true;
  });
  const pendingTasks = allTasks.filter((task) => {
    return task.completed !== true;
  });
  totalCount.textContent = allTasks.length;
  pendingCount.textContent = pendingTasks.length;
  completedCount.textContent = completedTasks.length;
};

const showTasks = () => {
  taskContainer.innerHTML = "";

  if (allTasks.length === 0) {
    taskContainer.innerHTML = `
        <div class =empty-state>
        <h3>No Task Yet </h3>
        <p>Add your first task to get started.</p>
        </div>`;
    updateDashboard();
    return;
  }

  allTasks.forEach((newTask, index) => {
    taskContainer.innerHTML += `<div class ="task-card ${newTask.completed ? "completed-card" : ""}">
            <div class="task-top">
    <h3 class="${newTask.completed ? "completed-title" : ""}">
        Title: ${newTask.title}
    </h3>

    <span class="task-badge">
        ${newTask.category}
    </span>
</div>
            <div class="task-buttons">

  ${newTask.completed ? "" : `<button id="complete" onclick="completeTask(${index})">Complete</button>`}

  <button id="edit" onclick="editTask(${index})">Edit</button>

  <button id="delete" onclick="deleteTask(${index})">Delete</button>

</div>

          
            
        </div>`;
  });
  updateDashboard();
};

const deleteTask = (index) => {
  let confirmDelete = confirm("Are you sure you want to delete this task");
  if (confirmDelete === false) {
    return;
  }
  allTasks.splice(index, 1);
  saveTask();
  showTasks();
};

const completeTask = (index) => {
  allTasks[index].completed = true;
  saveTask();

  showTasks();
};

const editTask = (index) => {
  let selectedTask = allTasks[index];

  form[0].value = selectedTask.title;
  form[1].value = selectedTask.category;

  updateIndex = index;
  submitBtn.textContent = "Update Task";
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let taskTitle = event.target[0].value;
  let taskCategory = event.target[1].value;

  if (taskTitle.trim() === "" || taskCategory.trim() === "") {
    alert("Please fill all fields");
    return;
  }
  let newTask = {
    title: taskTitle,
    category: taskCategory,
    compleded: false,
  };

  if (updateIndex !== null) {
    allTasks[updateIndex] = newTask;
    updateIndex = null;
    submitBtn.textContent = "Add Task";
  } else {
    allTasks.push(newTask);
  }
  saveTask();

  showTasks();
  event.target.reset();
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "Dark Mode";
  }
});

const loadTheme = () => {
  let savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "Dark Mode";
  }
};

const saveTask = () => {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
};

const loadTask = () => {
  let savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    allTasks = JSON.parse(savedTasks);
  }
  showTasks();
};

loadTheme();
loadTask();
