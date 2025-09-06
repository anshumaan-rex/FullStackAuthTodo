import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function EditTodo() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch existing todo details to prefill form
    async function fetchTodo() {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/todo/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setTitle(data.todo.title)
          setDescription(data.todo.description)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchTodo()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:4000/api/v1/todo/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        navigate("/dashboard")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Todo</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 rounded text-white"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-2 rounded text-white"
        />
        <button
          type="submit"
          disabled={!title || loading}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          {loading ? "Updating..." : "Update Todo"}
        </button>
      </form>
    </div>
  )
}
