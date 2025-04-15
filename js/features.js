async function loadTodos() {
    try {
      const todosContainer = document.getElementById('todos-container');
      todosContainer.innerHTML = '<p class="text-center">Loading...</p>';
      
      const todos = await fetchAuthenticatedData('todos');
      
      if (todos && todos.length > 0) {
        let html = '';
        todos.forEach(todo => {
          html += `
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title">${todo.title}</h5>
                <p class="card-text">${todo.description || ''}</p>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${todo.id})">Delete</button>
              </div>
            </div>
          `;
        });
        todosContainer.innerHTML = html;
      } else {
        todosContainer.innerHTML = '<p class="text-center">No todos found. Create one!</p>';
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
      document.getElementById('todos-container').innerHTML = 
        '<p class="text-center text-danger">Failed to load todos. Please try again later.</p>';
    }
}

async function addTodo() {
    const title = document.getElementById('new-todo-title').value.trim();
    if (!title) {
      alert('Please enter a title for your todo');
      return;
    }
    
    const description = document.getElementById('new-todo-desc').value.trim();
    
    try {
      await fetchAuthenticatedData('todos', 'POST', {
        title: title,
        description: description
      });
      
      // Clear form
      document.getElementById('new-todo-title').value = '';
      document.getElementById('new-todo-desc').value = '';
      
      // Reload todos
      loadTodos();
      
      alert('Todo added successfully!');
    } catch (error) {
      console.error('Failed to add todo:', error);
      alert('Failed to add todo. Please try again.');
    }
}

async function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await fetchAuthenticatedData(`todos/${id}`, 'DELETE');
        loadTodos();
      } catch (error) {
        console.error('Failed to delete todo:', error);
        alert('Failed to delete todo. Please try again.');
      }
    }
}