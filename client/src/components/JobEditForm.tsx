import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const UPDATE_JOB = gql`
  mutation UpdateJob($id: String!, $title: String!, $company: String!, $location: String!, $dateApplied: String!) {
    updateJob(id: $id, title: $title, company: $company, location: $location, dateApplied: $dateApplied) {
      id
      title
      company
      location
      date_applied
    }
  }
`;

interface JobEditFormProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    date_applied: string;
  };
  onClose: () => void;
}

const JobEditForm: React.FC<JobEditFormProps> = ({ job, onClose }) => {
  const [title, setTitle] = useState(job.title);
  const [company, setCompany] = useState(job.company);
  const [location, setLocation] = useState(job.location);
  const [dateApplied, setDateApplied] = useState(new Date(parseInt(job.date_applied)).toISOString().split('T')[0]);

  const [updateJob, { loading, error }] = useMutation(UPDATE_JOB, {
    refetchQueries: ['GetJobs']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateJob({
        variables: {
          id: job.id,
          title,
          company,
          location,
          dateApplied: new Date(dateApplied).getTime().toString()
        }
      });
      onClose();
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-xl font-medium">Edit Application</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-serif text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg font-serif"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2 border rounded-lg font-serif"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-lg font-serif"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-gray-700 mb-1">Date Applied</label>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className="w-full p-2 border rounded-lg font-serif"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-serif">{error.message}</p>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-serif hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white font-serif rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobEditForm; 