import express from 'express'
import bootstrap from './src/app.controller.js'
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve("config/.env") });
const app = express()
bootstrap(app, express)

app.get('/', (_, res) => res.send('Saraha App!'))
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))