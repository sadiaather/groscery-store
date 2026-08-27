import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config()
const dbConection = process.env.MONGODB_URL


const connectDB = async()=>{
   console.log(dbConection)
   try {
    await mongoose.connect(dbConection)
    
      console.log(chalk.blue.bgRed.bold('MongoDB connected successfully'));
   }
   catch(error){
     console.error('MongoDB connection failed:', error);
       process.exit(1)
    }
    
   }


export default connectDB

// import mongoose from "mongoose";

// import dotenv from "dotenv"

// import chalk from "chalk";
// import dns from "dns";

// dns.setServers(["8.8.8.8", "8.8.4.4"]);
// // dns.setDefaultResultOrder("ipv4first");
  
// dotenv.config()

// const dbConection = process.env.MONGODB_URL  


// const connectDB = async () => {
//   console.log(process.env.MONGODB_URL);
//     try {
//       await mongoose.connect(dbConection, {
//         dbName:"project_server"
//       });
      
      
//       console.log(chalk.blue.bgRed.bold('MongoDB connected successfully'));
//     } catch (error) {
//       console.error('MongoDB connection failed:', error);
//        process.exit(1)
//     }
//   };
  
//   export default  connectDB;
  