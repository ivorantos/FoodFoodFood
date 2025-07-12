import express from 'express'
// import cors from 'cors';
// import helmet from "helmet";
import recipesRouter from '../business-logic/routers/recipesRouter';

const app = express();

/*Middlewares*/
app.use(express.json());
// app.use(helmet());
/*todo change origin*/
// app.use(cors({ credentials: true, origin: 'http://localhost:3030'}))

/*Routes*/
app.use('/api/recetas', recipesRouter);


export default app;