// Theme switch
const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Task array
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTask() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.style.display = "none";
        return;
    }

    taskList.style.display = "block";

    for (let i = 0; i < tasks.length; i++) {
        const li = document.createElement("li");

        // Checkbox for completion
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = tasks[i].completed;
        checkBox.addEventListener("click", () => {
            tasks[i].completed = !tasks[i].completed;
            saveTasks();
            renderTask();
        });

        const text = document.createElement("span");
        text.textContent = tasks[i].text;
        if (tasks[i].completed) {
            text.classList.add("completed");
        }

        // Delete task button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteButton";
        deleteButton.addEventListener("click", () => {
            tasks.splice(i, 1);
            saveTasks();
            renderTask();
        });

        li.appendChild(checkBox);
        li.appendChild(text);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }
}

// Add task
const addButton = document.getElementById("addButton");

// Toast
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastYes = document.getElementById("toastYes");
const toastNo = document.getElementById("toastNo");
const overlay = document.getElementById("overlay");

function showToast(text, onYes) {
    toastMessage.textContent = text;
    toast.classList.add("show");
    overlay.classList.add("show");

    toastYes.onclick = () => {
        toast.classList.remove("show");
        overlay.classList.remove("show");
        onYes();
    }

    toastNo.onclick = () => {
        toast.classList.remove("show");
        overlay.classList.remove("show");
    }
}

function addTask() {
    const task = taskInput.value.trim();
    if (task === "") return;

    // Duplicate check
    const isDup = tasks.some(t => t.text.toLowerCase() === task.toLowerCase());
    if (isDup) {
        showToast(`"${task}" is already in your list! Add it anyway?`, () => {
        tasks.push({ text: task, completed: false });
            taskInput.value = "";
            saveTasks();
            renderTask();
        });
        return;    
    }

    tasks.push({ text: task, completed: false });
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