import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_JOBS = gql`
  query GetJobs {
    getJobs {
      id
      title
      company
      location
      date_applied
    }
  }
`;

const ScreenshotList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_JOBS);

  if (loading) return <p>Loading job applications...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{marginTop:'1rem'}}>
      <h3>Recent Applications</h3>
      <ul>
        {data.getJobs.map((job: any) => (
          <li key={job.id}>
            <strong>{job.title}</strong> @ {job.company} - {job.location} <br />
            <small>Applied: {new Date(job.date_applied).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScreenshotList;
