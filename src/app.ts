import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { setupSwagger } from './utils/swagger';
// import routes later

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

setupSwagger(app);

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import commentRoutes from './routes/commentRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api', commentRoutes);

app.get('/', (req, res) => {
    res.send('Profility API is running');
});

export default app;
