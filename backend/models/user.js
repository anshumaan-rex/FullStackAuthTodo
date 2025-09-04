import mongoose from "mongoose"

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase:  true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: [64, 'Password too long'],
    select: false
  },
  otp: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  }
},{
  timestamps: true
})

const User = mongoose.models.User || new mongoose.model("User", userSchema)

export default User