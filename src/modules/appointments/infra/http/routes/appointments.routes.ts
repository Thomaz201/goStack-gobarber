import { Router } from 'express';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthentication);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointmentsRepository = new AppointmentsRepository();
//   const appointmentList = await appointmentsRepository.find();

//   return response.json(appointmentList);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
