import mongoose from 'mongoose';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

const app = express();

const DB = process.env['DATABASE']!.replace('<PASSWORD>', process.env['DATABASE_PASSWORD']!);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection true'));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cors({ origin: '*' }));

const port = process.env['PORT'] || 3000;
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
