const API_URL = 'http://localhost:5000/api/tasks';

// Load tasks automatically when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// Fetch tasks from the backend and render them
async function loadTasks() {
    const taskList = document.getElementById('taskList');

    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        // Guard clause: ensure the backend returned an array
        if (!Array.isArray(tasks)) {
            console.error('Expected an array of tasks, but received:', tasks);
            taskList.innerHTML = `<p style="color: red;">Server Error: Failed to load task list structure.</p>`;
            return;
        }

        taskList.innerHTML = ''; // Clear current UI list

        if (tasks.length === 0) {
            taskList.innerHTML = '<p>No tasks found. Add a task to get started!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.status}`;
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description || ''}</p>
                </div>
                <div class="actions">
                    <button class="comp-btn" onclick="updateTaskStatus('${task._id}', '${task.status === 'Completed' ? 'Pending' : 'Completed'}')">
                        ${task.status === 'Completed' ? 'Undo' : 'Complete'}
                    </button>
                    <button onclick="deleteTask('${task._id}')">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    } catch (err) {
        console.error('Failed to grab task records:', err);
        taskList.innerHTML = `<p style="color: red;">Error connecting to server. Make sure backend is running.</p>`;
    }
}

// Add a new task
async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');

    if (!titleInput.value.trim()) {
        alert('Please provide a task title.');
        return;
    }

    const payload = {
        title: titleInput.value.trim(),
        description: descInput.value.trim()
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            titleInput.value = '';
            descInput.value = '';
            loadTasks(); // Refresh list
        } else {
            const errorData = await response.json();
            console.error('Server validation rejection:', errorData);
        }
    } catch (err) {
        console.error('Submission network error:', err);
    }
}

// Update task status (Complete / Pending)
async function updateTaskStatus(id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            loadTasks();
        }
    } catch (err) {
        console.error('Error updating task status:', err);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTasks();
        }
    } catch (err) {
        console.error('Error deleting task:', err);
    }
}