const express = require("express")
const cors = require("cors");
const shortid = require('shortid');

const server = express()
server.use(express.json())
server.use(cors());

const db = [
  {
    id: "iuwhg98h",
    name: "Jane Doe",
    bio: "Not Tarzan's Wife, another Jane"
  },
  {
    id: "giup394h",
    name: "Dane Joe",
    bio: "Hmm this sounds familiar"
  },
  {
    id: "wieugho9hf82",
    name: "Mike Jones",
    bio: "Who?"
  },
]

const validate = (user) => {
  if(user.name && user.name !== "" && user.bio && user.bio !== "") {
    return true
  }
  return false
}

const addUser = async (user) => {
  await db.push(user)
  return db
}

const getUsers = async () => {
  return db
}

const getUser = async (id) => {
  const user = await db.filter(item => {
    item.id === id
  })
  return user
}

const deleteUser = async (id) => {
  db.splice(db.findIndex(item => item.id === id), 1)
  return db
}

server.get("/api/users", async (req, res) => {
  const users = await getUsers()
  res.status(201).json(users)
})

server.get("/api/users/:id", async (req, res) => {
  const user = await getUser(req.params.id)
  if(user.length > 0) {
    res.status(201).json(user)
  } else {
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  }
})

server.delete("/api/users/:id", async (req, res) => {
  const user = await deleteUser(req.params.id)
  if(user.length > 0) {
    res.status(201).json(user)
  } else {
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  }
})

server.post("/api/users", async (req, res) => {
  if(validate(req.body)){
    const users = await addUser({ ...req.body, id: shortid.generate() })
    res.status(201).json(users)
  } else {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
  }
})

const port = process.env.PORT || 3025;

server.listen(port, () => console.log(`\n** server up on port ${port} **\n`));