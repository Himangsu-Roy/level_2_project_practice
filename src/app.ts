import express, { Application, NextFunction, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';

//parser
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {

  return res.status(500).json({
    success: false,
    message: err.message,
    error: err,
  });

});

export default app;
