/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

//parser
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api/v1/', router);
// app.use('/api/v1/users', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// global error handler
app.use(globalErrorHandler);

// unhandle Rejection test
// const test = async (req: Request, res: Response) => {
//   Promise.reject();
// };

// app.get('/', test); 


// Not Found router
// app.use('*', (req: Request, res: Response, next: NextFunction) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//     error: {
//       statusCode: 404,
//       message: 'You reached a route that is not defined on this server',
//     },
//   });
// });
app.use(notFound);

export default app;
