import React from 'react';
import { useQuery, gql } from '@apollo/client';

const JOB_STATS = gql`
  query JobStats {
    jobStats
  }
`;

const StatsView: React.FC = () => {
  const { data, loading, error } = useQuery(JOB_STATS);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{marginTop:'1rem'}}>
      <h3>Current Statistics</h3>
      <p>{data.jobStats}</p>
    </div>
  );
};

export default StatsView;
