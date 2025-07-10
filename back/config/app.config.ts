import express from 'express';

//todo keep this file to config rouetrs middlewares and start server y app.ts


const app = express();
app.use(express.json());

// app.use('/api/recetas', recetasRouter);np  

// const PORT = process.env.PORT || 3001;
app.listen(3001, () => console.log(`Servidor escuchando en puerto 3001`));
