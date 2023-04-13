import React, { useState, useEffect } from "react";
import InputTodo from "./InputTodo";
import "./style.css"

const ListTodo = () => {
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoDescription, setEditingTodoDescription] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:8000/todos");
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (newTodo) => {
    try {
      const response = await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      const data = await response.json();
      setTodos([...todos, data]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateTodo = async (id, description) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, description } : todo
        )
      );
      setEditingTodoId(null);
      setEditingTodoDescription("");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEditTodo = (id, description) => {
    setEditingTodoId(id);
    setEditingTodoDescription(description);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTodoDescription("");
  };

  const handleUpdateTodo = () => {
    updateTodo(editingTodoId, editingTodoDescription);
  };

  return (
    <div className="container">
      <InputTodo addTodo={addTodo} />
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr  key={todo.todo_id}>
              <td>
                {editingTodoId === todo.todo_id ? (
                  <input
                    type="text"
                    value={editingTodoDescription}
                    onChange={(e) => setEditingTodoDescription(e.target.value)}
                  />
                ) : (
                  todo.description
                )}
              </td>
              {editingTodoId === todo.todo_id ? (
                <div>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={handleUpdateTodo}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-secondary ml-2"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </td>
                </div>
              ) : (
                <div>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleEditTodo(todo.todo_id, todo.description)
                      }
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => deleteTodo(todo.todo_id)}
                    >
                      Delete
                    </button>
                  </td>
                </div>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListTodo;