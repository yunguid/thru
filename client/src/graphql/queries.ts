import { gql } from '@apollo/client';

export const GET_LOCATION_STATS = gql`
  query GetLocationStats {
    getLocationStats {
      location
      count
    }
  }
`;
