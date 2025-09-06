import { useEffect, useState } from "react"
import { TodoCard } from "../components/TodoCard"
import CreateTodo from "./CreateTodo"

export default function Dashboard() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [todoStatus, setTodoStatus] = useState(null)
  const [searchFilter, setSearchFilter] = useState("")
  const [debouncedFilter, setDebouncedFilter] = useState("")
  const [openCreateTodo, setOpenCreateTodo] = useState(false)

  useEffect(() => {
    if (!searchFilter) {
      setDebouncedFilter("")
      return
    }

    setIsSearching(true)
    const handler = setTimeout(() => {
      setDebouncedFilter(searchFilter)
      setIsSearching(false)
    }, 800)

    return () => {
      clearTimeout(handler)
      setIsSearching(false)
    }
  }, [searchFilter])

  // Fetch todos
  useEffect(() => {
    async function fetchTodos() {
      try {
        setLoading(true)

        const url =
          !debouncedFilter && !todoStatus
            ? "http://localhost:4000/api/v1/todo/all"
            : `http://localhost:4000/api/v1/todo/search?status=${todoStatus || ""}&filter=${debouncedFilter || ""}`

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })

        const data = await res.json()
        if (res.ok && data.success) {
          setTodos(data.todos || data.todo)
        } else {
          setTodos([])
        }
      } catch (err) {
        setTodos([])
      } finally {
        setLoading(false)
      }
    }
    fetchTodos()
  }, [todoStatus, debouncedFilter])

  return (
   <div
  className={`max-w-3xl mx-auto p-6 ${openCreateTodo ? "bg-black" : ""}`}>
      <div className="flex justify-between items-baseline text-center">
        <h2 className={`text-2xl font-bold mb-4 inline-block ${openCreateTodo ? "text-white": ""}`}>Your Todos</h2>
        <button onClick={()=> setOpenCreateTodo(state => !state)} className="text-white bg-blue-500 text-xl font-semibold px-3 py-1 rounded pb-2">Create <span className="text-2xl">+</span></button>
      </div>
      {openCreateTodo && <CreateTodo setTodos={setTodos}/>}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search todos"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${openCreateTodo ? "text-white placeholder-white" : ""}`}
        />
        <button
          onClick={() => setTodoStatus("completed")}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Completed
        </button>
        <button
          onClick={() => setTodoStatus("pending")}
          className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Pending
        </button>
        <button
          onClick={() => {
            setTodoStatus(null)
            setSearchFilter("")
          }}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Loading + Search + List */}
      {isSearching && <p className="text-blue-500">Searching...</p>}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : todos.length > 0 ? (
        <TodoCard todos={todos} setTodos={setTodos}/>
      ) : (
        <p className="text-gray-500">No todos found.</p>
      )}
    </div>
  )
}
