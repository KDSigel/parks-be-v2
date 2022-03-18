const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//routes//

//create a user
app.post("/users", async (req, res) => {
  try {
    const { email, password, favorites } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (email, password, favorites) VALUES($1, $2, $3) RETURNING *",
      [email, password, favorites]
    );
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get a specific user
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id=$1", [id]);
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//update a user
app.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, favorites } = req.body;
    await pool.query(
      "UPDATE users SET (email, password, favorites) = ($1, $2, $3) WHERE user_id = $4",
      [email, password, favorites, id]
    );
    res.json("updated user");
  } catch (error) {
    console.error(error.message);
  }
});

//delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE user_id=$1", [id]);
    res.json("user was deleted");
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("server on 5000");
});
