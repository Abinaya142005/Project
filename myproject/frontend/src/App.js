import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', completed: false });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', completed: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update this URL to match your Django server
  const API_BASE_URL = 'http://localhost:8000/api';

  // CREATE - Add new task
  const createTask = async () => {
    if (!newTask.title.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([...tasks, createdTask]);
        setNewTask({ title: '', completed: false });
        console.log('Task created successfully:', createdTask);
      } else {
        const errorData = await response.json();
        setError('Failed to create task: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Create task error:', err);
    }
    setLoading(false);
  };

  // READ - Fetch all tasks
  const readTasks = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching from:', `${API_BASE_URL}/tasks/`);
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        console.log('Tasks fetched successfully:', data);
      } else {
        const errorText = await response.text();
        setError('Failed to fetch tasks: ' + errorText);
        console.error('Error response:', errorText);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Fetch tasks error:', err);
    }
    setLoading(false);
  };

  // UPDATE - Full update (PUT)
  const updateTask = async (taskId) => {
    if (!editForm.title.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task._id === taskId 
            ? { ...task, title: editForm.title, completed: editForm.completed }
            : task
        ));
        setEditingTask(null);
        setEditForm({ title: '', completed: false });
        console.log('Task updated successfully');
      } else {
        const errorData = await response.json();
        setError('Failed to update task: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Update task error:', err);
    }
    setLoading(false);
  };

  // PATCH - Partial update (toggle completion)
  const toggleComplete = async (taskId, currentStatus) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task._id === taskId 
            ? { ...task, completed: !currentStatus }
            : task
        ));
        console.log('Task completion toggled successfully');
      } else {
        const errorData = await response.json();
        setError('Failed to toggle task completion: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Toggle complete error:', err);
    }
    setLoading(false);
  };

  // DELETE - Remove task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
        console.log('Task deleted successfully');
      } else {
        const errorData = await response.json();
        setError('Failed to delete task: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Delete task error:', err);
    }
    setLoading(false);
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditForm({ title: task.title, completed: task.completed });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: '', completed: false });
    setError('');
  };

  // Load tasks on component mount
  useEffect(() => {
    readTasks();
  }, []);

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>To Do List Manager</h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* CREATE Section */}
        <div className="section create-section">
          <h2>➕ Create New Task</h2>
          <div className="create-form">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="task-input"
              onKeyPress={(e) => e.key === 'Enter' && createTask()}
            />
            <button
              onClick={createTask}
              disabled={loading}
              className="btn btn-create"
            >
              {loading ? '⏳ Creating...' : '✅ Create Task'}
            </button>
          </div>
        </div>

        {/* READ Section */}
        <div className="section read-section">
          <div className="section-header">
            <h2>📋 Tasks List ({tasks.length})</h2>
            <button
              onClick={readTasks}
              disabled={loading}
              className="btn btn-refresh"
            >
              {loading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner">⏳</div>
              <p>Loading tasks...</p>
            </div>
          )}

          {tasks.length === 0 && !loading ? (
            <div className="no-tasks">
              <p>📝 No tasks found. Create your first task above!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-item ${task.completed ? 'completed' : 'pending'}`}
                >
                  {editingTask === task._id ? (
                    /* UPDATE Form */
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="task-input"
                        onKeyPress={(e) => e.key === 'Enter' && updateTask(task._id)}
                      />
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editForm.completed}
                          onChange={(e) => setEditForm({ ...editForm, completed: e.target.checked })}
                        />
                        Completed
                      </label>
                      <div className="edit-buttons">
                        <button
                          onClick={() => updateTask(task._id)}
                          disabled={loading}
                          className="btn btn-save"
                        >
                          💾 Update
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-cancel"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Task Display */
                    <div className="task-display">
                      <div className="task-info">
                        <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
                          {task.title}
                        </span>
                        <span className={`task-status ${task.completed ? 'status-completed' : 'status-pending'}`}>
                          {task.completed ? '✅ Completed' : '⏳ Pending'}
                        </span>
                      </div>
                      
                      <div className="task-actions">
                        {/* PATCH - Toggle Complete */}
                        <button
                          onClick={() => toggleComplete(task._id, task.completed)}
                          disabled={loading}
                          className={`btn ${task.completed ? 'btn-mark-pending' : 'btn-mark-complete'}`}
                        >
                          {task.completed ? '🔄 Mark Pending' : '✅ Mark Complete'}
                        </button>
                        
                        {/* UPDATE - Edit */}
                        <button
                          onClick={() => startEdit(task)}
                          className="btn btn-edit"
                        >
                          ✏️ Edit
                        </button>
                        
                        {/* DELETE */}
                        <button
                          onClick={() => deleteTask(task._id)}
                          disabled={loading}
                          className="btn btn-delete"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>🚀 Django REST API + React Frontend | All CRUD Operations Implemented</p>
        </div>
      </div>
    </div>
  );
}

export default App;