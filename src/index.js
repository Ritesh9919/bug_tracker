import 'dotenv/config'
import {connectDB} from '../src/db/connectDB.js'
import { app } from './app.js'
const PORT = process.env.PORT || 8000;


connectDB()
.then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server is running on port:${PORT}`)
    })
})
.catch((err)=> {
    console.error(err);
})


