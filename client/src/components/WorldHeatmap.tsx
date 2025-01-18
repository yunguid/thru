import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { GET_LOCATION_STATS } from '../graphql/queries';

interface LocationStat {
  location: string;
  count: number;
}

// Updated URL to a reliable source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const WorldHeatmap: React.FC = () => {
  const [geoError, setGeoError] = useState(false);
  const { data, loading, error } = useQuery<{ getLocationStats: LocationStat[] }>(GET_LOCATION_STATS);

  if (loading) return <p className="font-serif text-gray-600">Loading location distribution...</p>;
  if (error) return <p className="font-serif text-red-500">Error loading data: {error.message}</p>;
  if (geoError) return <p className="font-serif text-red-500">Error loading map data. Please try refreshing the page.</p>;

  const stats = data?.getLocationStats || [];
  const lookup: Record<string, number> = {};
  
  // Build lookup table
  stats.forEach((item) => {
    lookup[item.location.trim().toLowerCase()] = item.count;
  });

  // Calculate min/max for color scale
  const counts = Object.values(lookup);
  const minCount = counts.length ? Math.min(...counts) : 0;
  const maxCount = counts.length ? Math.max(...counts) : 1;

  // Create color scale
  const colorScale = scaleQuantize<string>()
    .domain([minCount, maxCount])
    .range([
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
    ]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full h-[500px] flex flex-col">
      <h3 className="font-serif text-xl font-medium text-gray-900 mb-4">
        World Heatmap: Applications by Country
      </h3>

      <div className="relative flex-1">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 30] // Adjust center point for better view
          }}
        >
          <Geographies 
            geography={geoUrl}
            onError={() => setGeoError(true)}
          >
            {({ geographies }) =>
              geographies.map((geo) => {
                // Updated to match the new geography data format
                const countryName = geo.properties.name?.toLowerCase();
                const value = lookup[countryName] || 0;
                const fillColor = value > 0 ? colorScale(value) : '#f3f4f6';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', opacity: 0.8 },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {counts.length > 0 && (
        <div className="flex gap-2 mt-3 text-sm justify-center items-center">
          <span className="font-serif text-gray-600">Fewer</span>
          {colorScale.range().map((color) => (
            <div
              key={color}
              className="w-5 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="font-serif text-gray-600">More</span>
        </div>
      )}
    </div>
  );
};

export default WorldHeatmap;