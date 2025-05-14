import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProject } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProject(id);
        setProject(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!project) {
    return <div className="text-gray-500 p-4">Project not found.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Project Details</h2>
        <div className="flex space-x-2">
          <Link
            to={`/projects/${id}/edit`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Edit
          </Link>
          <Link
            to="/projects"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Project ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.project_id}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Project Title</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.project_title}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">PAAS Code</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.paas_code || 'N/A'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Approval Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                project.approval_status_name === 'Approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.approval_status_name}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Fund</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.fund_code}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">PAG Value</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.pag_value ? `$${parseFloat(project.pag_value).toLocaleString()}` : 'N/A'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.start_date || 'N/A'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">End Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.end_date || 'N/A'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Country</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.country_name}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Lead Org Unit</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.lead_org_unit_name}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Theme</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.theme_name}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Total Expenditure</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.total_expenditure ? `$${parseFloat(project.total_expenditure).toLocaleString()}` : 'N/A'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Total Contribution</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.total_contribution ? `$${parseFloat(project.total_contribution).toLocaleString()}` : 'N/A'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Total PSC</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.total_psc ? `$${parseFloat(project.total_psc).toLocaleString()}` : 'N/A'}
            </dd>
          </div>

          {project.donors && project.donors.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Donors</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {project.donors.map((donor) => (
                    <li key={donor.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      {donor.donor_name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default ProjectDetail;
