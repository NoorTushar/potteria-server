const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
   res.send(`Potteria Server running at port: ${port}`);
});

app.listen(port, () => {
   console.log(`Potteria Server running at port: ${port}`);
});
