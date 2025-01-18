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
    },
    getApplicationTrends: async (_parent: any, args: { days: number }) => {
      const { days } = args;
      
      // Get daily counts
      const result = await query(`
        WITH RECURSIVE dates AS (
          SELECT CURRENT_DATE - INTERVAL '${days} days' AS day
          UNION ALL
          SELECT day + INTERVAL '1 day'
          FROM dates
          WHERE day < CURRENT_DATE
        )
        SELECT 
          dates.day::date,
          COALESCE(COUNT(ja.id), 0) as count
        FROM dates
        LEFT JOIN job_applications ja 
          ON DATE(ja.date_applied) = dates.day
        GROUP BY dates.day
        ORDER BY dates.day
      `);

      return result.rows.map((row: any) => ({
        day: row.day.toISOString().split('T')[0],
        count: parseInt(row.count, 10)
      }));
    },
    getLocationStats: async () => {
      const result = await query(`
        SELECT 
          COALESCE(location, 'Unknown') as location,
          COUNT(*) as count
        FROM job_applications
        GROUP BY location
        ORDER BY count DESC
        LIMIT 15
      `);
      
      return result.rows.map((row: any) => ({
        location: row.location,
        count: parseInt(row.count, 10)
      }));
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

    updateJob: async (_parent: any, args: { id: string, title: string, company: string, location: string, dateApplied: string }, _ctx: GraphQLContext) => {
      try {
        const result = await query(
          'UPDATE job_applications SET title = $1, company = $2, location = $3, date_applied = to_timestamp($4::bigint / 1000) WHERE id = $5 RETURNING *',
          [args.title, args.company, args.location, args.dateApplied, args.id]
        );
        return result.rows[0];
      } catch (err) {
        console.error('Error updating job:', err);
        throw new Error('Failed to update job application');
      }
    },

    deleteJob: async (_parent: any, args: { id: string }, _ctx: GraphQLContext) => {
      try {
        await query('DELETE FROM job_applications WHERE id = $1', [args.id]);
        return true;
      } catch (err) {
        console.error('Error deleting job:', err);
        return false;
      }
    },
  },
};
