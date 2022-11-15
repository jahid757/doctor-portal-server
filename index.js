const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra')
const fileUpload = require('express-fileupload');

require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'))
app.use(fileUpload())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9mirr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
  const doctorCollection = client.db("doctorsPortal").collection("doctor");

  console.log('Server connect success');

  app.post('/addAppointment',(req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  });

  app.post('/appointmentByDate',(req, res) => {
    const date = req.body;
    const email = req.body.email
    const filter = {date: date.date}

    doctorCollection.find({email: email})
    .toArray((err, doctor) => {
        if(doctor.length === 0) {
          filter.email = email
        }
        appointmentCollection.find(filter)
          .toArray((err, documents) => {
              res.send(documents)
        })
    })


  })


  // all patients

  app.get('/appointments', (req, res) => {
    appointmentCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  app.post('/addDoctor',(req, res) => {
    const file = req.files.file
    const name = req.body.name
    const email = req.body.email
    const phone = req.body.phone

    // const filePath = `${__dirname}/doctors/${file.name}`;

    // const newImg = file.data
    // const encImg = newImg.toString('base64');

    // console.log(name,email,file);





    // file.mv(filePath, err => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(500).send({msg:'file upload unsuccessful'})
    //   }
      const newImg = req.files.file.data //fs.readFileSync(filePath)
      const encImg = newImg.toString('base64');
      
      const image = {
        contentType: file.mimetype,
        size: file.size,
        img: /*file.name*/ Buffer.from(encImg, 'base64')
    };

      doctorCollection.insertOne({ name, email, image, phone })
      .then(result => {
        // fs.remove(filePath,error => {
        //   if(error){
        //     console.log(error);
        //   }
          res.send(result.insertedCount > 0);
      //   })
      // })


    })
  })

    app.get('/doctors', (req, res) => {
      doctorCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });


  app.post('/isDoctor',(req, res) => {
    const email = req.body.email

    doctorCollection.find({email: email})
    .toArray((err, doctor) => {
        res.send(doctor.length > 0);
    })
  })

});



























app.get('/',(req, res) =>{
    res.send('Server Is Running...')
})

app.listen(process.env.PORT||5001)