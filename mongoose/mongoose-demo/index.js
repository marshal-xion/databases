const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/mongooseDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, default: 18, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Create model
const User = mongoose.model('User', userSchema);

// CRUD operations
async function run() {
  try {
    // Create
    const newUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    });
    await newUser.save();
    console.log('User created:', newUser);

    // Read all
    const users = await User.find();
    console.log('All users:', users);

    // Read one
    const user = await User.findOne({ email: 'john@example.com' });
    console.log('Found user:', user);

    // Update
    await User.updateOne({ email: 'john@example.com' }, { age: 26 });
    console.log('User updated');

        // Read all
        const users1 = await User.find();
        console.log('All users:', users1);
        
    // Delete
    await User.deleteOne({ email: 'john@example.com' });
    console.log('User deleted');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

run();