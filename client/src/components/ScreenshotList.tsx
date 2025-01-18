import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import JobEditForm from './JobEditForm';

const GET_JOBS = gql`
  query GetJobs {
    getJobs {
      id
      title
      company
      location
      date_applied
    }
  }
`;

const DELETE_JOB = gql`
  mutation DeleteJob($id: String!) {
    deleteJob(id: $id)
  }
`;

const ScreenshotList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_JOBS);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [deleteJob] = useMutation(DELETE_JOB, {
    refetchQueries: ['GetJobs']
  });

  if (loading) return <p className="font-serif text-gray-600">Loading job applications...</p>;
  if (error) return <p className="font-serif text-red-500">Error: {error.message}</p>;

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteJob({ variables: { id } });
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  return (
    <div className="px-6 py-4">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center cursor-pointer mb-6 relative"
      >
        <h3 className="font-serif text-2xl font-medium text-gray-900">Recent Applications ({data.getJobs.length})</h3>
        <span className="text-xl text-gray-500 transform transition-transform duration-200 ml-2" style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'block' : 'hidden'
      }`}>
        <div className="space-y-5">
          {data.getJobs.map((job: any) => (
            <div 
              key={job.id} 
              className="bg-gray-50 hover:bg-gray-100 rounded-xl p-5 relative group transition-all duration-200 cursor-pointer"
              onClick={() => setEditingJob(job)}
            >
              <div className="font-serif text-xl font-medium text-gray-900 mb-1">{job.title}</div>
              <div className="font-serif text-gray-700">{job.company} • {job.location}</div>
              <div className="font-serif text-sm text-gray-500 mt-2">
                Applied: {new Date(parseInt(job.date_applied)).toLocaleString()}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(job.id);
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-blue-500 text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white"
                aria-label="Delete application"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {editingJob && (
        <JobEditForm 
          job={editingJob} 
          onClose={() => setEditingJob(null)} 
        />
      )}
    </div>
  );
};

export default ScreenshotList;
