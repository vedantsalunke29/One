import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import bodyParser from 'body-parser';
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000

connectDB();

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
const corsConfig = {
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credential: true
}
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

// app.get("/", cors(), (req, res) => {

// })

app.use("/", userRoutes);
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, '/frontend/dist/index.html')));


app.listen(port, () => console.log(`Server running on port: ${port}`))
