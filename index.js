import  express  from "express";
import { usersRouter } from "./routes/users.js";
import 'dotenv/config'
import cors from "cors"
import { postRouter } from "./routes/post.js";
import { dataBaseConnection } from "./db.js";
import { isAuthenticated } from "./auth.js";

const app = express();
const PORT = 9000;

//Inbuilt middleware
app.use(express.json())
app.use(cors())

//mongoDB connection

dataBaseConnection();


app.get('/',(req,res)=>{
    res.send(' Welcome To Social Media App')
})

app.use('/users',usersRouter)
app.use('/post',isAuthenticated,postRouter)

app.listen(PORT,()=> console.log('The server started on the port',PORT))