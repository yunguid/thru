import React from 'react';
import QuickCoverForm from '../components/QuickCoverForm';

const CoverLetterPage: React.FC = () => {
  return (
    <div style={{padding:'1rem'}}>
      <h2>Generate Quick Cover Letter</h2>
      <QuickCoverForm />
    </div>
  );
};

export default CoverLetterPage;
