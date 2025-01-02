const mongoose=require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'please enter username'],
      unique:true,
    },
    name: {
      type: String,
      required: [true, 'Please enter name'],
    },
    country: {
      type: String,
      required: [true, 'Please enter country'],
    },
    city: {
        type: String,
        required: [true, 'Please enter city'],
    },
    isAdult: {
        type: Boolean,
        required: true,
    }
  }
)

module.exports = mongoose.model('User', userSchema)