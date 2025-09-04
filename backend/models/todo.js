import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [40, "Title is too long. Max supported length is 40 characters"],
    trim: true
  },
  description: {
    type: String,
    maxlength: [400, "description is too long. Maximun supported length is 400 characters "],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {timestamps: true})


const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema)

export default Todo