import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const GEN_COVER = gql`
  mutation GenerateCoverLetter($jobTitle: String!, $company: String!, $location: String!) {
    generateCoverLetter(jobTitle: $jobTitle, company: $company, location: $location) {
      id
      cover_letter_text
      created_at
    }
  }
`;

const QuickCoverForm: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [generateCover, { data, loading, error }] = useMutation(GEN_COVER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateCover({ variables: { jobTitle, company, location }});
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title: </label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
        </div>
        <div>
          <label>Company: </label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </div>
        <div>
          <label>Location: </label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <button disabled={loading} type="submit">
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </form>
      {error && <p style={{ color:'red' }}>Error: {error.message}</p>}
      {data && data.generateCoverLetter && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <h4>Cover Letter</h4>
          <p>{data.generateCoverLetter.cover_letter_text}</p>
        </div>
      )}
    </div>
  );
};

export default QuickCoverForm;
