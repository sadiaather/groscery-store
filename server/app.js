
import express from "express";
import connectDB from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import cors from 'cors'
import dns from "node:dns";
import { Server } from "socket.io";
import http from "http"
import AdminRoutes from "./routes/AdminRoutes.js"
import ProductRoutes from "./routes/ProductRoutes.js" 


dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();




// HTTP Server
const server = http.createServer (app);

// Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST","DELETE", "PUT","PATCH"],
  credentials: true 
}});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
})
const PORT = 5000;
connectDB()

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST","DELETE", "PUT","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// MiddleWare
app.use(express.json());

app.use((req,res,next)=>{
  console.log(req.url,req.method)
  next();
})

app.use('/api/auth',AuthRoutes)
app.use("/api/admin",AdminRoutes)
app.use("/api/products", ProductRoutes);



server.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
});
app.set("io", io)
