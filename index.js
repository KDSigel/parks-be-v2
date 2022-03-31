const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//copied from version 1.0
const request = require("superagent");

//middleware
app.use(cors());
app.use(express.json());

//routes//

//get all parks
app.get("/parks", async (req, res) => {
  try {
    const response = await request
      .get(
        `https://developer.nps.gov/api/v1/parks?limit=20&start=${req.query.start}&api_key=${process.env.PARKS_KEY}`
      )
      .set({ accept: "application/json" });
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get one park by id
app.get("/parkDetail/:parkcode", async (req, res) => {
  try {
    const parkCode = req.params.parkcode;
    const response = await request
      .get(
        `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${process.env.PARKS_KEY}`
      )
      .set({ accept: "application/json" });
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//search for park(s)
app.get("/search", async (req, res) => {
  try {
    const searchFor = req.query.q;
    const response = await request
      .get(
        `https://developer.nps.gov/api/v1/parks?q=${searchFor}&api_key=${process.env.PARKS_KEY}`
      )
      .set({ accept: "application/json" });
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//create a user
app.post("/users", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES($1, $2) RETURNING *",
      [email, password]
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
    const { email, password } = req.body;
    await pool.query(
      "UPDATE users SET (email, password) = ($1, $2) WHERE user_id = $3",
      [email, password, id]
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

//create a comment
app.post("/comments", async (req, res) => {
  try {
    const { comment, parkcode, owner_id } = req.body;
    const newComment = await pool.query(
      "INSERT INTO comments (comment, parkcode, owner_id) VALUES($1, $2, $3) RETURNING *",
      [comment, parkcode, owner_id]
    );
    res.json(newComment.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all comments for a specific park
app.get("/comments/:parkCode", async (req, res) => {
  try {
    const allComments = await pool.query(
      "SELECT * FROM comments WHERE parkcode = $1",
      [req.params.parkCode]
    );
    res.json(allComments.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// update a comment
app.patch("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const updatedComment = await pool.query(
      "UPDATE comments SET comment = $1 WHERE comment_id = $2",
      [comment, id]
    );
    res.json("updated comment success");
  } catch (error) {
    console.error(error.message);
  }
});

//delete a comment
app.delete("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await pool.query(
      "DELETE FROM comments WHERE comment_id = $1",
      [id]
    );
    res.json("comment deleted");
  } catch (error) {
    console.error(error.message);
  }
});

//add a favorite
app.post("/favorites", async (req, res) => {
  try {
    const { parkcode, user_id } = req.body;
    const newFavorite = await pool.query(
      "INSERT INTO favorites (parkcode, user_id) VALUES($1, $2) RETURNING *",
      [parkcode, user_id]
    );
    res.json(newFavorite.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all favorites
app.get("/favorites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allFavorites = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [id]
    );
    res.json(allFavorites.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//delete a favorite
app.delete("/favorites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { parkcode } = req.body;
    const deletedFavorite = await pool.query(
      "DELETE FROM favorites WHERE parkcode = $1 AND user_id = $2",
      [parkcode, id]
    );
    res.json("favorite deleted");
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("server on 5000");
});
