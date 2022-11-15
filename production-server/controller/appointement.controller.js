const { getDb } = require("../utils/dbConnect");
const { ObjectId } = require("mongodb");
const appointment = [
  { id: 1, name: "king 1" },
  { id: 2, name: "king 2" },
  { id: 3, name: "king 3" },
];
module.exports.getAllAppointments = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const db = getDb();
    const tools = await db
      .collection("tools")
      .find({})
      .project({ _id: 0 })
      .limit(Number(limit))
      .skip(+limit * page)
      .toArray();

    res.status(200).json({ success: true, data: tools });
  } catch (error) {
    next(error);
  }
};

module.exports.saveAppointments = async (req, res, next) => {
  try {
    const db = getDb();
    const tools = req.body;
    const result = await db.collection("tools").insertOne(tools);
    if (!result.insertedId) {
      return res
        .status(400)
        .send({ status: false, err: "Somethings went wrong" });
    }
    res.status(200).send({
      success: true,
      message: `Tools added with id: ${result.insertedId}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.appointmentDetails = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, err: "Not a valid tool id" });
    }
    const tool = await db.collection("tools").findOne({ _id: ObjectId(id) });
    if (!tool) {
      return res
        .status(400)
        .json({ success: false, err: "Couldn't find tool with this id" });
    }
    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAppointments = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, err: "Not a valid tool id" });
    }
    const result = await db.collection("tools").updateOne(
      { _id: ObjectId(id) },
      {
        $set: req.body,
      }
    );
    if (!result.modifiedCount) {
      return res.status(400).json({ success: false, err: "Data not updated" });
    }
    res.status(200).json({ success: true, message: "Data updated" });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllAppointmentsById = (req, res) => {
  res.send("Get request done with id");
};

module.exports.deleteAppointments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, err: "Not a valid tool id" });
    }
    const result = await db
      .collection("tools")
      .deleteOne({ _id: ObjectId(id) });
    if (!result.deletedCount) {
      return res
        .status(400)
        .json({ success: false, err: "couldn't delete this tool" });
    }
    res.status(200).json({ success: true, message: "delete successfully" });
  } catch (error) {
    next(error);
  }
};



module.exports.createFakeUser = async (req,res) => {
  for (let i = 0; i < 100000; i++) {
    const db = getDb();
    db.collection('test').insertOne({name:`fake user ${i}`,number:i})
  }
}
module.exports.getFakeUser = async (req,res) => {
  const db = getDb();
  const result = await db.collection('test').find({number:99999}).toArray();
  res.json(result);
}