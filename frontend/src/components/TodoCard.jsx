import { Link } from "react-router-dom";

export const TodoCard = ({ todos, setTodos }) => {
  return (
    <div className="grid gap-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <p className="text-lg font-semibold">Title: {todo.title}</p>
          <p className="text-gray-700">Description: {todo.description}</p>
          <p
            className={`font-medium ${
              todo.completed ? "text-green-600" : "text-yellow-600"
            }`}
          >
            Status: {todo.completed ? "Completed" : "Pending"}
          </p>
          <div className="flex justify-between">
            <button
              onClick={async () => {
                try {
                  await fetch(`http://localhost:4000/api/v1/todo/toggle/${todo._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                  });

                  // Update local state to re-render immediately
                  setTodos(
                    todos.map((t) =>
                      t._id === todo._id ? { ...t, completed: !t.completed } : t
                    )
                  );
                } catch (err) {
                  console.error("Error toggling todo:", err);
                }
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {todo.completed ? "Not yet completed?" : "Mark as completed"}
            </button>
            <Link
              to={`/edit/${todo._id}`}
              className="bg-black text-white rounded px-3 py-2"
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
