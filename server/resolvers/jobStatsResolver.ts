import { screenshotService } from '../llm/screenshotService';
import { GraphQLContext } from '../types';
import { query } from '../db';

export const jobStatsResolver = {
  Query: {
    getJobs: async (_parent: any, _args: any, _ctx: GraphQLContext) => {
      const result = await query('SELECT * FROM job_applications ORDER BY date_applied DESC');
      return result.rows;
    },
    getRecentJobs: async (_parent: any, args: { n: number }, _ctx: GraphQLContext) => {
      const { n } = args;
      const result = await query('SELECT * FROM job_applications ORDER BY date_applied DESC LIMIT $1', [n]);
      return result.rows;
    },
    jobStats: async () => {
      const result = await query('SELECT COUNT(*) as total FROM job_applications');
      const totalCount = parseInt(result.rows[0].total);
      return `Total Applications: ${totalCount}`;
    }
  },
  Mutation: {
    uploadScreenshot: async (_parent: any, args: { base64Image: string }, _ctx: GraphQLContext) => {
      // Convert base64 image to job data
      const jobData = await screenshotService(args.base64Image);

      // Insert job application record into PostgreSQL
      const result = await query(
        'INSERT INTO job_applications (title, company, location, salary_range, date_applied, screenshot_url) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *',
        [jobData.title, jobData.company, jobData.location, jobData.salary_range, jobData.screenshot_url]
      );
      return result.rows[0];
    },
  },
};
