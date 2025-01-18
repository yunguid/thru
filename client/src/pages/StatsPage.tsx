import React from 'react';
import StatsView from '../components/StatsView';
import ApplicationsTimelineChart from '../components/ApplicationsTimelineChart';
import WorldHeatmap from '../components/WorldHeatmap';

const StatsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="font-serif text-2xl font-medium text-gray-900">
          Application Stats
        </h2>

        <ApplicationsTimelineChart />
        <WorldHeatmap />
        <StatsView />
      </div>
    </div>
  );
};

export default StatsPage;