import Todo from "../models/todo.js";
import { validateTodoCreateSchema, validateTodoUpdateSchema } from "../validations/todo.js";

export const createTodo = async (req, res) => {
  try {
    const validate = validateTodoCreateSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({
        success: false,
        errors: validate.error.issues.map((issue) => ({
          path: issue.path[0],
          error: issue.message,
        })),
      });
    }
    const { title, description } = validate.data;

    const todo = await Todo.create({
      title,
      description,
      completed: false,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Todo created",
      todo,
    });
  } catch (err) {
    console.error("Error in creating todo", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const allTodos = await Todo.find({ user: req.user._id });

    if (allTodos.length === 0) {
      return res.status(200).json({
        success: true,
        todos: [],
        message: "Currently no todos are there",
      });
    }

    return res.status(200).json({
      success: true,
      todos: allTodos,
      message: "Todos found",
    });
  } catch (err) {
    console.error("Error in fetching todos:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getSpecificTodo = async (req, res) => {
  const filter = req.query?.filter;
  const status = req.query?.status;

  if (!filter) {
    return res.status(400).json({
      success: false,
      message: "filter query is required",
    });
  }

  try {
    const query = {
      user: req.user._id,
      $or: [
        { title: { $regex: filter, $options: "i" } },
        { description: { $regex: filter, $options: "i" } },
      ],
    };

    if (status === "completed") query.completed = true;
    else if (status === "pending") query.completed = false;

    const todos = await Todo.find(query);

    if (todos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No todos found with this title or description",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todos found",
      todo: todos,
    });
  } catch (err) {
    console.error("Error in searching todos:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateTodo = async (req,res) => {
  try{
    const { id } = req.params
    const todo = await Todo.findOne({ user: req.user._id, _id: id})
    if(!todo) {
      return res.status(404).json({
        success: false,
        message: "No todo found"
      })
    }
    const validate = validateTodoUpdateSchema.safeParse(req.body)
    if (!validate.success) {
      return res.status(400).json({
        success: false,
        errors: validate.error.issues.map((issue) => ({
          path: issue.path[0],
          error: issue.message,
        })),
      });
    }
    if(validate.data.title) todo.title = validate.data.title
    if(validate.data.description) todo.description = validate.data.description
    if(validate.data.completed !== undefined) todo.completed = validate.data.completed 

    await todo.save()

    return res.status(200).json({
      success: true,
      message: "Todo updated",
      todo
    })
  }catch(err){
    console.error("Error in updating todos:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ user: req.user._id, _id: id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting todo:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
