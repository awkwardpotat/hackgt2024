// Local Storage keys
const INCOMPLETE_TASKS_KEY = 'incompleteTasks';
const COMPLETED_TASKS_KEY = 'completedTasks';

// Load tasks from localStorage
function loadTasks(key) {
    const tasksJSON = localStorage.getItem(key);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

// Save tasks to localStorage
function saveTasks(key, tasks) {
    localStorage.setItem(key, JSON.stringify(tasks));
}

// Render tasks (works for both incomplete and completed)
function renderTasks(containerID, tasks, isCompleted) {
    const taskContainer = document.getElementById(containerID);
    taskContainer.innerHTML = '';
    document.getElementById("incomplete").innerHTML = "HELLO";

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        if (!isCompleted) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('click', () => {
                task.completed = checkbox.checked;
                if (checkbox.checked) {
                    moveTaskToCompleted(task, index);
                }
                saveTasks(INCOMPLETE_TASKS_KEY, tasks);
                renderTasks(containerID, tasks, isCompleted);
            });
            taskDiv.appendChild(checkbox);
        }

        const paragraph = document.createElement('p');
        paragraph.textContent = task.text;
        paragraph.className = isCompleted ? 'line-through' : '';
        if (!isCompleted) {
            paragraph.contentEditable = 'true';
            paragraph.addEventListener('input', () => {
                task.text = paragraph.textContent;
                saveTasks(INCOMPLETE_TASKS_KEY, tasks);
            });
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks(isCompleted ? COMPLETED_TASKS_KEY : INCOMPLETE_TASKS_KEY, tasks);
            renderTasks(containerID, tasks, isCompleted);
        });

        taskDiv.appendChild(paragraph);
        taskDiv.appendChild(deleteButton);
        taskContainer.appendChild(taskDiv);
    });
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('new-task-input');
    const taskText = taskInput.value.trim();
    if (taskText) {
        const incompleteTasks = loadTasks(INCOMPLETE_TASKS_KEY);
        incompleteTasks.push({ text: taskText, completed: false });
        saveTasks(INCOMPLETE_TASKS_KEY, incompleteTasks);
        renderTasks('task-container', incompleteTasks, false);
        taskInput.value = '';
    }
}

// Clear all completed tasks
function clearCompletedTasks() {
    localStorage.setItem(COMPLETED_TASKS_KEY, '');
}

// Initialize the page
function initPage() {
    const isCompletedPage = window.location.pathname.includes('completed.html');
    const tasks = loadTasks(isCompletedPage ? COMPLETED_TASKS_KEY : INCOMPLETE_TASKS_KEY);
    renderTasks('task-container', tasks, isCompletedPage);

    if (!isCompletedPage) {
        document.getElementById('add-task-button').addEventListener('click', addTask);
    } else {
        document.getElementById('clear-tasks-button').addEventListener('click', clearCompletedTasks);
    }
}

// Call initPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);
renderTasks();