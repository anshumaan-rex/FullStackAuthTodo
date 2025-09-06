import { useState } from "react"

export default function CreateTodo({ setTodos }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleAddTodo(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const res = await fetch("http://localhost:4000/api/v1/todo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setTodos((prev) => [data.todo, ...prev])
        setTitle("")
        setDescription("")
      }
    } catch (err) {
      console.log("Error adding todo", err)
    } finally {
      setLoading(false)
    }
  }
  handleAddTodo()


  return (
<div className="mb-5">
  <h2 className="text-2xl font-bold mb-4 text-white">Add Todo</h2>
  <form onSubmit={handleAddTodo} className="flex gap-2">
    <input
      type="text"
      name="title"
      value={title}
      placeholder="Title"
      onChange={(e) => setTitle(e.target.value)}
      className="px-3 py-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      type="text"
      name="description"
      value={description}
      placeholder="Description"
      onChange={(e) => setDescription(e.target.value)}
      className="px-3 py-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      type="submit"
      disabled={!title || loading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add"}
    </button>
  </form>
</div>
  )
}
