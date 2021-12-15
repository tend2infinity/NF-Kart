import bcrypt from "bcryptjs"

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Stanley Hudson",
    email: "stanley@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Kevin Malone",
    email: "kevin@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
]
export default users
