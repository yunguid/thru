import { coverLetterService } from '../llm/coverLetterService';
import { GraphQLContext } from '../types';
import { query } from '../db';

export const coverLetterResolver = {
  Query: {
    getAllCoverLetters: async (_parent: any, _args: any, _ctx: GraphQLContext) => {
      const result = await query('SELECT * FROM covers ORDER BY created_at DESC');
      return result.rows;
    },
  },
  Mutation: {
    generateCoverLetter: async (_parent: any, args: {jobTitle: string, company: string, location: string}, _ctx: GraphQLContext) => {
      const { jobTitle, company, location } = args;
      const coverLetterText = await coverLetterService(jobTitle, company, location);

      // Insert into PostgreSQL
      const result = await query(
        'INSERT INTO covers (user_name, job_title, company, cover_letter_text, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        ['Luke', jobTitle, company, coverLetterText]
      );
      return result.rows[0];
    },
  },
};
