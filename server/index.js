const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db.js");
//middleware
app.use(cors());
app.use(express.json());
//routes//
//post create todo
app.post("/todos", async(req,res)=>{
    //await
    try{
        console.log(req.body);
        const {description} = req.body
        const newtodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        res.json(newtodo);
    }catch(err){
        console.log(err.message);
    }
})
//get all todos
app.get("/todos", async(req,res)=>{
    try{
        const alltodos = await pool.query("SELECT * FROM todo");
        res.json(alltodos.rows);
    }catch(err){
        console.log(err.message);
    }
})
//get a todo
app.get("/todos/:id", async(req,res)=>{
    try{
      console.log(req.params);
      const {id} = req.params
      const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
      res.send(todo);

    }catch(err){
        console.log(err.message);
    }
})
app.put("/todos/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const {description} = req.body;
        await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        const updatedTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        console.log(updatedTodo.rows);
        res.json(updatedTodo.rows[0]);
    } catch(err){
        console.log(err.message);
    }
})


// delete delete a todo

app.delete("/todos/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedtodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json(deletedtodo);
        // console.log();

    }catch(err){
        console.log(err.message);
    }
})




app.listen(8000, ()=>{
    console.log("server up");
})