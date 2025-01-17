
import { makeExecutableSchema } from '@graphql-tools/schema';
import { coverLetterResolver } from './resolvers/coverLetterResolver';
import { jobStatsResolver } from './resolvers/jobStatsResolver';

const typeDefs = `#graphql
  type JobApplication {
    id: String!
    title: String
    company: String
    location: String
    salary_range: String
    date_applied: String
    screenshot_url: String
  }

  type CoverLetter {
    id: String!
    user_name: String
    job_title: String
    company: String
    cover_letter_text: String
    created_at: String
  }

  type Query {
    # Return all job applications
    getJobs: [JobApplication!]!

    # Return last n job applications
    getRecentJobs(n: Int!): [JobApplication!]!

    # Return stats about total count, daily count, etc.
    jobStats: String

    # Return generated cover letters
    getAllCoverLetters: [CoverLetter!]!
  }

  type Mutation {
    # Process a screenshot (base64-encoded or upload) - returns created JobApplication
    uploadScreenshot(base64Image: String!): JobApplication

    # Generate a quick cover letter
    generateCoverLetter(jobTitle: String!, company: String!, location: String!): CoverLetter
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      ...jobStatsResolver.Query,
      ...coverLetterResolver.Query,
    },
    Mutation: {
      ...jobStatsResolver.Mutation,
      ...coverLetterResolver.Mutation,
    },
  },
});