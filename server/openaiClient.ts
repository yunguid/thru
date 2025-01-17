import { OpenAI } from 'openai';
import debug from 'debug';

const log = debug('arkon:openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default client;
