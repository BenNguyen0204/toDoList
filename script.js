// Theme switch
const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Task array
const taskInput = document.getElementById("taskInput")
const taskList = document.getElementById("taskList");

// Load Task from local storage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render task
function renderTask() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.style.display = "none";
        return;
    }

    taskList.style.display = "block";

    for (let i = 0; i < tasks.length; i++) {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = tasks[i];

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteButton";

        deleteButton.addEventListener("click", () => {
            tasks.splice(i, 1);
            saveTasks();
            renderTask();
        });

        li.appendChild(text);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    }
}

// Add task
const addButton = document.getElementById("addButton");

function addTask() {
    const task = taskInput.value.trim();
    if (task === "") {
        return;
    }

    tasks.push(task);
    taskInput.value = "";
    saveTasks();
    renderTask();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTask();