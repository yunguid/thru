import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  defs,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const GET_APPLICATION_TRENDS = gql`
  query GetApplicationTrends($days: Int!) {
    getApplicationTrends(days: $days) {
      day
      count
    }
  }
`;

interface DailyTrend {
  day: string;
  count: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow p-2 font-serif">
        <p className="text-gray-800 text-sm">
          <span className="font-medium">Date:</span>{' '}
          {new Date(label).toLocaleDateString()}
        </p>
        <p className="text-gray-800 text-sm">
          <span className="font-medium">Applications:</span>{' '}
          {payload[0].value as number}
        </p>
      </div>
    );
  }
  return null;
};

const ApplicationsTimelineChart: React.FC = () => {
  const { data, loading, error } = useQuery<{ getApplicationTrends: DailyTrend[] }>(
    GET_APPLICATION_TRENDS,
    { variables: { days: 60 } }
  );
  const [chartData, setChartData] = useState<DailyTrend[]>([]);

  useEffect(() => {
    if (data?.getApplicationTrends) {
      setChartData(data.getApplicationTrends);
    }
  }, [data]);

  if (loading) {
    return <p className="font-serif text-gray-600">Loading timeline...</p>;
  }
  if (error) {
    return <p className="font-serif text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
        Applications Over Time
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid and Axes */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              fontSize={12}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              stroke="#6b7280"
              tickFormatter={(value) => Math.round(value)}
              fontSize={12}
              width={40}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Area/Line */}
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorApplications)"
              dot={false}
              isAnimationActive
              animationDuration={800}
              name="Applications"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ApplicationsTimelineChart;