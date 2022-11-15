const express = require("express");
const bodyParser = require("body-parser");
const appointmentApi = require("./routes/v1/appointment.route");
const errorHandler = require("./middleware/errorHandler");
const { connectToServer } = require("./utils/dbConnect");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");


connectToServer((err) => {
  if(!err){
    app.listen(process.env.PORT || 5000, console.log("Server Is Open"));
  }else{
    console.log(err)
  }
});

app.use("/api/v1/appointmentApi", appointmentApi);

app.get("/", (req, res) => {
  // res.send('Server Is Running...')
  // res.sendFile(__dirname + '/public/index.html')
  res.render("index.ejs", {
    id: 2,
    user: {
      name: "Jahid",
    },
  });
});

app.all("*", (req, res) => {
  res.send("Route is not found");
});
app.use(errorHandler);



process.on("unhandledRejection",(error) => {
  console.log(error.name,error.message,)
  app.close(() => {
    process.exit(1)
  })
})