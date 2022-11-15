const { Router } = require("express");
const express = require("express");
const appointmentsController = require("../../controller/appointement.controller");
const { limiter } = require("../../middleware/requestLimit");
const viewCount = require("../../middleware/viewCount");
const router = express.Router();

// router.get('/', (req,res) => {
//     res.send('api is success with')
// })
// router.post('/:id', (req,res) => {
//     res.send(`post id ${req.params.id}`)
// })

router
  .route("/")
  /*



  * @api {get} /api/v1/appointmentApi All tools
  * @apiDescription get all appointment
  * @apiPermission admin
  * 
  * apiHeader {string} Authorization user's access token
  * 
  * @apiParam {number{1-}}     [page=1]        list page
  * @apiParam {number{1-100}}  [limit=10]      User per page
  * 
  * @apiSuccess {Object[]} all the appointment
  * 
  * @apiError (unauthorized 401)  Unauthorized Only authenticated users can access the data
  * @apiError (Forbidden 403)     Forbidden    Only admins can access the data


*/

  .get(limiter, appointmentsController.getAllAppointments)
  /*



  * @api {get} /api/v1/appointmentApi All tools
  * @apiDescription get all appointment
  * @apiPermission admin
  * 
  * apiHeader {string} Authorization user's access token
  * 
  * @apiParam {number{1-}}     [page=1]        list page
  * @apiParam {number{1-100}}  [limit=10]      User per page
  * 
  * @apiSuccess {Object[]} all the appointment
  * 
  * @apiError (unauthorized 401)  Unauthorized Only authenticated users can access the data
  * @apiError (Forbidden 403)     Forbidden    Only admins can access the data


*/

  .post(appointmentsController.saveAppointments);

router
  .route("/test")
  .post(appointmentsController.createFakeUser)
  .get(appointmentsController.getFakeUser);

router
  .route("/:id")
  .get(viewCount, appointmentsController.appointmentDetails)
  .post(viewCount, appointmentsController.getAllAppointmentsById)
  .patch(appointmentsController.updateAppointments)
  .delete(appointmentsController.deleteAppointments);
module.exports = router;
