import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database Connection

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mylogin', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Connected');
    } catch (error) {
        console.error('DB connection error', error);
    }
};

connectDB();

// User Schema and Model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

// Routes

app.post("/login", async (req,res)=>{
    const { email, password } = req.body;

    try{
        const user = await User.findOne({email:email});
        if(user){
            if(password === user.password){
                res.send({message:"login successfuly"})
            }else{
                res.send({message:"password is wrong"})
            }
        }
        else{
            res.send({message:"user not register"})
        }
    }
    catch (err) {
        res.status(500).send({ message: "Server error" });
    }
})
app.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                firstName,
                lastName,
                email,
                password
            });
            await newUser.save();
            res.send({ message: "Successfully saved" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start Server
app.listen(9002, () => {
    console.log("Server running on port 9002");
});
