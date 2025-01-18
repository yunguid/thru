/**
 * Main entry point for the Node server:
 * - Creates Express app
 * - Sets up Apollo GraphQL server
 * - Connects to PostgreSQL database
 * - Provides file upload endpoint for screenshots
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { schema } from './schema';
import dotenv from 'dotenv';
import initDb from './db/init';
import debug from 'debug';

const log = {
  http: debug('arkon:http'),
  apollo: debug('arkon:apollo'),
  system: debug('arkon:system')
};

dotenv.config();

const app = express();

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    log.http({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  next();
});

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

const CLIENT_DIST = process.env.CLIENT_DIST || path.join(__dirname, '../client/dist');
log.system('Static files directory:', CLIENT_DIST);

// Serve static files from the React app
app.use(express.static(CLIENT_DIST));

interface ResponseBody {
  singleResult?: {
    data: any;
    errors?: any;
  };
  kind?: string;
  initialResult?: {
    data: any;
    errors?: any;
  };
  data?: any;
  errors?: any;
}

// Create Apollo server with logging
const server = new ApolloServer({
  schema,
  plugins: [{
    async requestDidStart({ request }) {
      const start = Date.now();
      log.apollo('Request:', {
        query: request.query,
        variables: request.variables,
        operationName: request.operationName
      });

      return {
        async willSendResponse({ response }) {
          const duration = Date.now() - start;
          let responseData = null;
          let responseErrors = null;

          const body = response.body as ResponseBody;

          if ('singleResult' in body) {
            responseData = body.singleResult?.data;
            responseErrors = body.singleResult?.errors;
          } else if ('kind' in body && body.kind === 'incremental') {
            responseData = body.initialResult?.data;
            responseErrors = body.initialResult?.errors;
          } else {
            responseData = body.data;
            responseErrors = body.errors;
          }
            
          log.apollo('Response:', {
            data: responseData,
            errors: responseErrors,
            duration: `${duration}ms`
          });
        }
      };
    }
  }]
});

// Fix the response handling
const extractTextFromResponse = async (response: Response) => {
  const responseData = await response.json();
  return {
    data: responseData.data,
    errors: responseData.errors
  };
};

// Start the Apollo server and initialize database
(async () => {
  try {
    log.system('Initializing database...');
    await initDb();
    
    log.system('Starting Apollo server...');
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    // Basic health check
    app.get('/health', (req, res) => {
      res.send('OK');
    });

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    });

    // Start listening
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      log.system(`Server running on http://localhost:${PORT}`);
      log.system('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        DB_HOST: process.env.DB_HOST,
        CLIENT_DIST
      });
    });
  } catch (err) {
    const error = err as Error;
    log.system('Failed to start server:', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
})();
