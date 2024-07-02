import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 8;

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the todos!', error);
      });
  }, []);

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    const newTodoItem = {
      title: newTodo,
      completed: false,
    };

    axios.post('https://jsonplaceholder.typicode.com/todos', newTodoItem)
      .then(response => {
        setTodos([response.data, ...todos]);
        setNewTodo('');
      })
      .catch(error => {
        console.error('There was an error creating the todo!', error);
      });
  };

  const handleEditTodoChange = (event) => {
    setEditTodo({
      ...editTodo,
      title: event.target.value,
    });
  };

  const handleUpdateTodo = () => {
    axios.put(`https://jsonplaceholder.typicode.com/todos/${editTodo.id}`, editTodo)
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo.id === editTodo.id ? response.data : todo
        );
        setTodos(updatedTodos);
        setEditTodo(null);
      })
      .catch(error => {
        console.error('There was an error updating the todo!', error);
      });
  };

  const handleDeleteTodo = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('There was an error deleting the todo!', error);
      });
  };

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalPages = Math.ceil(todos.length / todosPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="new-todo">
        <input
          type="text"
          value={newTodo}
          onChange={handleNewTodoChange}
          placeholder="Enter a new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      {editTodo && (
        <div className="edit-todo">
          <input
            type="text"
            value={editTodo.title}
            onChange={handleEditTodoChange}
            placeholder="Edit todo"
          />
          <button onClick={handleUpdateTodo}>Update Todo</button>
          <button onClick={() => setEditTodo(null)}>Cancel</button>
        </div>
      )}
      <ul className="todo-list">
        {currentTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {todo.title}
            <button onClick={() => setEditTodo(todo)}>Edit</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-number">Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
