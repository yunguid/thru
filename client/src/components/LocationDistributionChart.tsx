import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';

import { GET_LOCATION_STATS } from '../graphql/queries'; // or wherever your query is

interface LocationStat {
  location: string; // e.g. "United States", "Canada", "India"
  count: number;
}

/**
 * A publicly accessible TopoJSON file for world geography.
 * Alternatively, you can store a local .json or .geojson and import it.
 * This URL is one commonly used for example maps.
 */
const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

const WorldHeatmap: React.FC = () => {
  const { data, loading, error } = useQuery<{ getLocationStats: LocationStat[] }>(
    GET_LOCATION_STATS
  );

  if (loading) {
    return <p className="font-serif text-gray-600">Loading location distribution...</p>;
  }
  if (error) {
    return <p className="font-serif text-red-500">Error: {error.message}</p>;
  }

  // Convert our location stats into a lookup table by country name
  const locationLookup = useMemo(() => {
    if (!data?.getLocationStats) return {};
    const table: Record<string, number> = {};
    data.getLocationStats.forEach((item) => {
      // Some data cleansing if needed:
      // e.g. convert "United States (San Francisco)" -> "United States"
      // or handle synonyms. For demonstration, we assume direct match.
      table[item.location.trim().toLowerCase()] = item.count;
    });
    return table;
  }, [data]);

  // Find min & max counts to build a color scale
  const counts = Object.values(locationLookup);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  // Create a d3 scale that maps the count to a color range (light → dark)
  const colorScale = useMemo(() => {
    return scaleQuantize<string>()
      .domain([minCount, maxCount])
      .range([
        '#e0f2fe', // lighter (few applications)
        '#bae6fd',
        '#7dd3fc',
        '#38bdf8',
        '#0ea5e9',
        '#0284c7',
        '#0369a1',
        '#075985', // darker (most applications)
      ]);
  }, [minCount, maxCount]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full h-[500px] flex flex-col">
      <h3 className="font-serif text-xl font-medium text-gray-900 mb-4">
        World Heatmap: Applications by Country
      </h3>

      <div className="relative flex-1">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120, // Adjust as needed for zoom
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.NAME?.toLowerCase();
                const value = locationLookup[countryName] || 0;
                const fillColor = value > 0 ? colorScale(value) : '#f3f4f6'; // gray if no data

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#fff" // country borders
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

      {/* OPTIONAL LEGEND */}
      {counts.length > 0 && (
        <div className="flex gap-2 mt-3 text-sm justify-center items-center">
          <span className="font-serif text-gray-600">Fewer</span>
          {colorScale.range().map((clr) => (
            <div
              key={clr}
              className="w-5 h-3 rounded-sm"
              style={{ backgroundColor: clr }}
            />
          ))}
          <span className="font-serif text-gray-600">More</span>
        </div>
      )}
    </div>
  );
};

export default WorldHeatmap;