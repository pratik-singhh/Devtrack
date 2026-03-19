const express = require('express');
const pool = require('./db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {

      return res.status(401).json({ error: "Token Not Provided" });
    }
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();

  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ error: "invalid token" });


  }
};


app.get('/', (req, res) => {
  res.send("Hello");
  console.log("This is home page");
});

app.get('/projects', authMiddleware, async (req, res) => {

  try {

    const userID = req.user.userID;

    const result = await pool.query('SELECT * FROM projects WHERE user_id=$1', [userID]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }

});


app.post('/projects', authMiddleware, async (req, res) => {

  try {
    const { name } = req.body;
    const userID = req.user.userID;
    if (!name) {
      return res.status(400).json({ error: "name is required" });


    }
    const result = await pool.query('INSERT INTO projects(name, user_id) VALUES($1, $2) RETURNING *', [name, userID]);
    res.status(201).json(result.rows[0]);
  }

  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


app.put('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userID = req.user.userID;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const result = await pool.query('UPDATE projects SET name=$1 WHERE id=$2 AND user_id=$3 RETURNING *;', [name, id, userID])

    if (result.rows.length === 0) {
      return (res.status(403).json({ error: "Not Authorized or Project Not Found" }));
    }
    res.status(200).json(result.rows[0]);


  }
  catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");


  }
})


app.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.userID;

    const result = await pool.query('DELETE FROM projects WHERE id=$1 AND user_id=$2 RETURNING *;', [id, userID])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not Authorized or Project Not Found" });
    }
    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" })


  }
})



app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: "Client Error" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO users(email,password) VALUES($1,$2) RETURNING id,email;', [email, hashedpassword]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "server error" });


  }

});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password Required" });
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1 ;', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const foundUser = user.rows[0];

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (isMatch) {
      const token = jwt.sign({ userID: foundUser.id }, "secretkey");
      console.log("Login Accepted")
      res.status(200).json({ token });
    }
    else {
      console.log("Invalid Credentials")
      res.status(400).json({ error: "Login Failed" });
    }


  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });


  }
})



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sever is running on ${PORT}`);
});
