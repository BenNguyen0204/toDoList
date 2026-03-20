// Theme switch
const themeButton = document.getElementById("themeButton");

// Load tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
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

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Migrate old tasks without id
tasks.forEach(t => {
    if (!t.id) t.id = Date.now() + Math.random();
});
saveTasks();

// Update counters
function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById("totalCount").textContent = `Total: ${total}`;
    document.getElementById("activeCount").textContent = `Active: ${active}`;
    document.getElementById("completedCount").textContent = `Completed: ${completed}`;
}

// Empty state
const emptyState = document.getElementById("emptyState");

// Drag and drop
tasksList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = tasksList.querySelector(".dragging");
    if (!dragging) return;

    const siblings = [...tasksList.querySelectorAll("li:not(.dragging)")];

    let insertBefore = null;
    for (const s of siblings) {
        const rect = s.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
            insertBefore = s;
            break;
        }
    }

    tasksList.insertBefore(dragging, insertBefore);

    const newOrder = [...tasksList.querySelectorAll("li")].map(el => {
        return tasks.find(t => String(t.id) === el.dataset.id);
    }).filter(Boolean);

    tasks.length = 0;
    newOrder.forEach(t => tasks.push(t));
});

// Render tasks
function renderTask() {
    tasksList.innerHTML = "";

    const filtered = tasks.filter(t => {
        if (currentFilter == "active") return !t.completed;
        if (currentFilter == "completed") return t.completed;
        return true;
    });

    if (filtered.length === 0) {
        tasksList.style.display = "none";
        emptyState.style.display = "block";
        updateCounters();
        return;
    }

    tasksList.style.display = "block";
    emptyState.style.display = "none";

    for (let i = 0; i < filtered.length; i++) {
        const task = filtered[i];
        const realIndex = tasks.findIndex(t => t.id === task.id);

        const li = document.createElement("li");
        li.dataset.id = String(task.id);
        li.draggable = true;

        li.addEventListener("dragstart", () => {
            li.classList.add("dragging");
            saveTasks();
        });

        li.addEventListener("dragend", () => {
            li.classList.remove("dragging");
            saveTasks();
        });

        // Checkbox for completion
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = task.completed;
        checkBox.addEventListener("click", () => {
            const idx = tasks.findIndex(t => t.id === task.id);
            if (idx === -1) return;
            tasks[idx].completed = !tasks[idx].completed;
            saveTasks();
            renderTask();
        });

        const text = document.createElement("span");
        text.textContent = task.text;
        if (task.completed) {
            text.classList.add("completed");
        }

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "editButton";
        const editImg = document.createElement("img");
        editImg.src = "images/edit.png";
        editImg.alt = "Edit Icon";
        editButton.appendChild(editImg);
        editButton.addEventListener("click", () => {
            const idx = tasks.findIndex(t => t.id === task.id);
            if (idx === -1) return;
            showEditToast(idx);
        });

        // Delete task button
        const delImg = document.createElement("img");
        delImg.src = "images/delete.png";
        delImg.alt = "Delete";
        const deleteButton = document.createElement("button");
        deleteButton.className = "deleteButton";
        deleteButton.appendChild(delImg);
        deleteButton.addEventListener("click", () => {
            const idx = tasks.findIndex(t => t.id === task.id);
            if (idx === -1) return;
            tasks.splice(idx, 1);
            saveTasks();
            renderTask();
        });


        const buttonGroup = document.createElement("div");
        buttonGroup.className = "buttonGroup";
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        li.appendChild(checkBox);
        li.appendChild(text);
        li.appendChild(buttonGroup);
        tasksList.appendChild(li);
    }
    updateCounters();
}

// Show edit toast
function showEditToast(index) {
    toastMessage.textContent = "Edit task:";
    const input = document.createElement("input");
    input.type = "text";
    input.value = tasks[index].text;
    input.className = "toastInput";
    toastMessage.appendChild(input);

    toast.classList.add("show");
    overlay.classList.add("show");
    input.focus();

    toastYes.textContent = "Save";
    toastNo.textContent = "Cancel";

    toastYes.onclick = () => {
        const newText = input.value.trim();
        if (newText === "") {
            return;
        }
        tasks[index].text = newText;
        saveTasks();
        renderTask();
        toast.classList.remove("show");
        overlay.classList.remove("show");
    };

    toastNo.onclick = () => {
        toast.classList.remove("show");
        overlay.classList.remove("show");
    };
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

    const isDup = tasks.some(t => t.text.toLowerCase() === task.toLowerCase());
    if (isDup) {
        showToast(`"${task}" is already in your list! Add it anyway?`, () => {
            tasks.push({ id: Date.now(), text: task, completed: false });
            taskInput.value = "";
            saveTasks();
            renderTask();
        });
        return;
    }

    tasks.push({ id: Date.now(), text: task, completed: false });
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