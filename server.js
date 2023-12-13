const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));
app.use(express.json());
const connection = mysql.createConnection({
  host: "10.0.0.2", // Use the IP address of the MySQL container if running on a different machine
  user: "root",
  password: "pass@123",
  database: "formdata", // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/",(req,res)=>{
    connection.query("CREATE TABLE IF NOT EXISTS records (prn VARCHAR(255), name VARCHAR(255))", (err, results) => {
        if (err) {
            console.error("Error creating table:", err);
            res.status(500).json({ success: false });
        } else {
            console.log("Table created successfully");
        }
    });
    res.sendFile(__dirname+"/views/index.html");
})

app.post("/api/insert", (req, res) => {

    
  const { prn, name } = req.body;
  if (prn && name) {
    connection.query("INSERT INTO records (prn, name) VALUES (?, ?)", [prn, name], (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.status(400).json({ success: false, message: "Missing PRN or Name" });
  }
});

app.get("/api/select", (req, res) => {
  connection.query("SELECT * FROM records", (err, results) => {
    if (err) {
      console.error("Error selecting data:", err);
      res.status(500).json([]);
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
