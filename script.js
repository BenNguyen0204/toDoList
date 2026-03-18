// Theme switch
const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Filter
let currentFilter = "all";
const filterToggle = document.getElementById("filterToggle");
const filterMenu = document.getElementById("filterMenu");

filterToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    filterMenu.classList.toggle("open");
});

document.addEventListener("click", () => {
    filterMenu.classList.remove("open");
});

filterMenu.addEventListener("click", (e) => {
    e.stopPropagation();
});

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener("change", () => {
        currentFilter = radio.value;
        renderTask();
    })
})

// Task array
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasksList");

// Load tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTask() {
    tasksList.innerHTML = "";

    const filtered = tasks.filter(t => {
        if(currentFilter == "active") return !t.completed;
        if(currentFilter == "completed") return t.completed;
        return true;
    });

    if (filtered.length === 0) {
        tasksList.style.display = "none";
        return;
    }

    tasksList.style.display = "block";

    for (let i = 0; i < filtered.length; i++) {
        const task = filtered[i];
        const realIndex = tasks.indexOf(task);

        const li = document.createElement("li");

        // Checkbox for completion
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = task.completed; 
        checkBox.addEventListener("click", () => {
            tasks[realIndex].completed = !tasks[realIndex].completed;
            saveTasks();
            renderTask();
        });

        const text = document.createElement("span");
        text.textContent = task.text;
        if (task.completed) {
            text.classList.add("completed");
        }

        // Delete task button
        const delImg = document.createElement("img");
        delImg.src = "images/delete.png";
        delImg.alt = "Delete";

        const deleteButton = document.createElement("button");
        deleteButton.className = "deleteButton";
        deleteButton.appendChild(delImg);
        deleteButton.addEventListener("click", () => {
            tasks.splice(realIndex, 1);
            saveTasks();
            renderTask();
        });

        li.appendChild(checkBox);
        li.appendChild(text);
        li.appendChild(deleteButton);
        tasksList.appendChild(li);
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