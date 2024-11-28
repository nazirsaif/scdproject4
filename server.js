const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path'); 

const app = express();


app.use(cors());


app.use(bodyParser.json()); 


app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/weatherwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB locally");
}).catch((error) => {
  console.log("Error connecting to MongoDB:", error);
});


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true } 
});

const User = mongoose.model('User', userSchema);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.send('Welcome to the Weather-Wise App!');
});


app.post('/signup', async (req, res) => {
  const { name, email, password, username } = req.body;

  console.log("Received data:", { name, email, password, username }); 

  const newUser = new User({ name, email, password, username });

  try {
    await newUser.save(); 
    console.log('User saved to DB!');
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    console.log('Error saving user:', error); 
    res.status(500).json({ error: "Error registering user" });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email, password });
    if (user) {
      
      res.sendFile(path.join(__dirname,  'homepage.html'));
    } else {
     
      res.status(401).json({ error: "Incorrect email or password" });
    }
  } catch (error) {
    
    res.status(500).json({ error: "Error logging in" });
  }
});


app.get('/home', (req, res) => {
  res.send('Welcome to your personalized Weather-Wise homepage!');
});


app.get('/signout', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
