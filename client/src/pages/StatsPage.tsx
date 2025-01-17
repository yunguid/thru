import React from 'react';
import StatsView from '../components/StatsView';

const StatsPage: React.FC = () => {
  return (
    <div style={{padding:'1rem'}}>
      <h2>Application Stats</h2>
      <StatsView />
    </div>
  );
};

export default StatsPage;
