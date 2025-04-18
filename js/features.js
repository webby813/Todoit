async function addTodo() {
    const title = document.getElementById('new-todo-title').value.trim();
    if (!title) {
      alert('Please enter a title for your todo');
      return;
    }
    
    const description = document.getElementById('new-todo-desc').value.trim();
    const token = localStorage.getItem("auth_token")

    try {
      const response = await fetch(api_base + 'new-todo',{
        method:'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            description: description
        })
      })

      const data = await response.json();
      if(response.ok){
        alert("New task added");
        document.getElementById('new-todo-title').value = '';
        document.getElementById('new-todo-desc').value = '';
        loadTodos();
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
      alert('Failed to add todo. Please try again.');
    }
}

//wait for the API
async function loadTodos() {
  const todosContainer = document.getElementById("todos-container");
  todosContainer.innerHTML = '<p class="text-center">Loading...</p>';

  const token = localStorage.getItem("auth_token");

  try {
    const response = await fetch(api_base + 'all-todos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const raw = await response.json();
    const todos = raw.data; // 👈 This is the correct todos array

    if (!todos || todos.length === 0) {
      todosContainer.innerHTML = '<p class="text-center">No todos yet. Add one!</p>';
      return;
    }

    todosContainer.innerHTML = todos.map(todo => `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${todo.title}</h5>
          <p class="card-text">${todo.description || ""}</p>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Failed to load todos:", error);
    todosContainer.innerHTML = `<p class="text-center text-danger">Failed to load todos.</p>`;
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