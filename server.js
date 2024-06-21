const express = require("express");
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const classRoutes = require('./routes/classRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const faceRecognitionRoute = require("./routes/faceRecognitionRoutes")


dotenv.config()

const app = express();

PORT = process.env.PORT || 5001;
connectDB();


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors())


app.get("/", (req,res)=> {
    res.send("hello");
})

app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentsRoutes);
app.use("/api/faceRecognition",faceRecognitionRoute);



app.listen(PORT, (req,res) => {
    console.log("server running at port 5001");
})