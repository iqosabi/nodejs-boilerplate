import 'reflect-metadata';
import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path'; // Pastiin import ini ada
import dotenv from 'dotenv';

import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middlewares/error.middleware';
import { connectDatabase } from '@/database/connection';
import config from '@/utils/config';

dotenv.config();

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.express = express();
    this.port = config.PORT || 3010;

    connectDatabase();

    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());

    morgan.token('timestamp', () =>
      new Date().toISOString().replace('T', ' ').replace('Z', '')
    );
    this.express.use(
      morgan('[:timestamp] [http] :method :url :status - :response-time ms')
    );

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());

    // ⬇️ Tambahin ini buat serve static file logo
    this.express.use(
      '/logos',
      express.static(path.join(__dirname, '../public/logos'))
    );
    this.express.use(
      '/logo',
      express.static(path.join(__dirname, '../assets/images'))
    );
  }


  
  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.express.use('/api/v1', controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }


  public listen(): void {
    this.express.listen(this.port, '0.0.0.0', () => {
      console.info(`🚀 RUN ON PORT ${this.port}`);
    });
  }
}

export default App;
