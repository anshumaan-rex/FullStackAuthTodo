export const TodoCard = ({ todos }) => {
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
          <button
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {todo.completed ? "Not yet completed?" : "Mark as completed"}
          </button>
        </div>
      ))}
    </div>
  )
}
