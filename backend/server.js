require('dotenv').config();
const cors = require('cors');
const express = require('express');
const pool = require('./db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {

      return res.status(401).json({ error: "Token Not Provided" });
    }
    const token = authHeader.split(' ')[1] || authHeader;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
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


app.get('/projects/:id/tasks', authMiddleware, async (req, res) => {
  try {

    const { id } = req.params;

    const userID = req.user.userID;
    const checkAuthority = await pool.query('SELECT * FROM projects WHERE user_id = $1 AND id = $2', [userID, id])

    if (checkAuthority.rows.length !== 0) {
      const result = await pool.query('SELECT * FROM tasks WHERE project_id = $1', [id]);
      res.json(result.rows);
    }
    else throw new Error("User Invalid");
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({ error: 'Server Error' });
  }

})


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


app.post('/projects/:id/tasks', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.userID;
    const checkAuthority = await pool.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, userID]);
    if (checkAuthority.rows.length !== 0) {
      const name = req.body.name;
      if (!name) {
        return res.status(400).json({ error: "Name cannot be empty" })
      }
      const result = await pool.query('INSERT INTO tasks(name,project_id) VALUES($1,$2) RETURNING *', [name, id]);
      return res.status(201).json(result.rows[0]);

    }
    else {
      res.status(403).json({ error: "Forbidden Access" });
    }

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Server Error" });

  }
})





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

app.put('/tasks/:id', authMiddleware, async (req, res) => {

  const { id } = req.params;
  const { name, completed } = req.body;
  const userID = req.user.userID;

  const check = await pool.query(
    'SELECT tasks.id FROM tasks JOIN projects ON tasks.project_id=projects.id WHERE tasks.id=$1 AND projects.user_id=$2;',
    [id, userID]
  )
  if (check.rows.length !== 0) {

    const result = await pool.query('UPDATE tasks SET name = COALESCE($1,name), completed=COALESCE($2,completed) WHERE id=$3 RETURNING *', [name, completed, id])

    return res.status(200).json(result.rows[0]);
  }
  else {
    return res.status(403).json({ error: "Forbidden Access" });
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

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.userID;
    const check = await pool.query('SELECT tasks.id FROM tasks JOIN projects ON projects.id=tasks.project_id WHERE projects.user_id=$1 AND tasks.id=$2', [userID, id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Not Authorized" });
    }
    const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);

    res.status(200).json(result.rows[0]);


  } catch (error) {
    return res.status(500).json({ error: "Server Error" });

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
      const token = jwt.sign({ userID: foundUser.id }, process.env.JWT_SECRET);
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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sever is running on ${PORT}`);
});
