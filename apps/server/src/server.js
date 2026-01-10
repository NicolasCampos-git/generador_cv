import express from 'express';
import cors from 'cors'
import curriculumsRouter from './modules/curriculums/presentation/curriculim.router.js';
import errorHandler from './code/middlewares/errorHandler.middleware.js'


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());

app.use('/api/curriculums', curriculumsRouter);




app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`todo ready en el purto ${PORT} brrroder`);
});