import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProject, createProject, updateProject } from '../services/api';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    project_id: '',
    project_title: '',
    paas_code: '',
    approval_status: '',
    fund: '',
    pag_value: '',
    start_date: '',
    end_date: '',
    country: '',
    lead_org_unit: '',
    theme: '',
    total_expenditure: '',
    total_contribution: '',
    total_psc: ''
  });

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [approvalStatuses, setApprovalStatuses] = useState([]);
  const [funds, setFunds] = useState([]);
  const [countries, setCountries] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    // Fetch dropdown data (in a real app, these would be API calls)
    setApprovalStatuses([
      { id: 1, status_name: 'Approved' },
      { id: 2, status_name: 'Pending Approval' }
    ]);
    
    setFunds([
      { id: 1, fund_code: 'FNO' },
      { id: 2, fund_code: 'FNE' },
      { id: 3, fund_code: 'FOD' },
      { id: 4, fund_code: 'FJO' },
      { id: 5, fund_code: 'QXB' }
    ]);
    
    setCountries([
      { id: 1, country_name: 'GLOBAL' },
      { id: 2, country_name: 'Kenya' },
      { id: 3, country_name: 'Uganda' }
    ]);
    
    setOrgUnits([
      { id: 1, org_unit_name: 'Urban Economy' },
      { id: 2, org_unit_name: 'Urban Planning' }
    ]);
    
    setThemes([
      { id: 1, theme_name: 'Urban Economy' },
      { id: 2, theme_name: 'Urban Planning' }
    ]);

    // If editing, fetch the project data
    if (isEditing) {
      const loadProject = async () => {
        try {
          const data = await fetchProject(id);
          setFormData({
            project_id: data.project_id,
            project_title: data.project_title,
            paas_code: data.paas_code || '',
            approval_status: data.approval_status,
            fund: data.fund,
            pag_value: data.pag_value || '',
            start_date: data.start_date || '',
            end_date: data.end_date || '',
            country: data.country,
            lead_org_unit: data.lead_org_unit,
            theme: data.theme,
            total_expenditure: data.total_expenditure || '',
            total_contribution: data.total_contribution || '',
            total_psc: data.total_psc || ''
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to load project data. Please try again.');
          setLoading(false);
        }
      };

      loadProject();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateProject(id, formData);
      } else {
        await createProject(formData);
      }
      navigate('/projects');
    } catch (err) {
      setError('Failed to save project. Please check your data and try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading project data...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Edit Project' : 'Add New Project'}
        </h2>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 text-red-700 border-l-4 border-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {!isEditing && (
            <div className="sm:col-span-3">
              <label htmlFor="project_id" className="block text-sm font-medium text-gray-700">
                Project ID
              </label>
              <input
                type="number"
                name="project_id"
                id="project_id"
                value={formData.project_id}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          )}

          <div className="sm:col-span-6">
            <label htmlFor="project_title" className="block text-sm font-medium text-gray-700">
              Project Title
            </label>
            <input
              type="text"
              name="project_title"
              id="project_title"
              value={formData.project_title}
              onChange={handleChange}
              required
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="paas_code" className="block text-sm font-medium text-gray-700">
              PAAS Code
            </label>
            <input
              type="text"
              name="paas_code"
              id="paas_code"
              value={formData.paas_code}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="approval_status" className="block text-sm font-medium text-gray-700">
              Approval Status
            </label>
            <select
              id="approval_status"
              name="approval_status"
              value={formData.approval_status}
              onChange={handleChange}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Status</option>
              {approvalStatuses.map(status => (
                <option key={status.id} value={status.id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="fund" className="block text-sm font-medium text-gray-700">
              Fund
            </label>
            <select
              id="fund"
              name="fund"
              value={formData.fund}
              onChange={handleChange}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Fund</option>
              {funds.map(fund => (
                <option key={fund.id} value={fund.id}>
                  {fund.fund_code}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="pag_value" className="block text-sm font-medium text-gray-700">
              PAG Value
            </label>
            <input
              type="number"
              step="0.01"
              name="pag_value"
              id="pag_value"
              value={formData.pag_value}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="lead_org_unit" className="block text-sm font-medium text-gray-700">
              Lead Org Unit
            </label>
            <select
              id="lead_org_unit"
              name="lead_org_unit"
              value={formData.lead_org_unit}
              onChange={handleChange}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Org Unit</option>
              {orgUnits.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.org_unit_name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Theme</option>
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.theme_name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="total_expenditure" className="block text-sm font-medium text-gray-700">
              Total Expenditure
            </label>
            <input
              type="number"
              step="0.01"
              name="total_expenditure"
              id="total_expenditure"
              value={formData.total_expenditure}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="total_contribution" className="block text-sm font-medium text-gray-700">
              Total Contribution
            </label>
            <input
              type="number"
              step="0.01"
              name="total_contribution"
              id="total_contribution"
              value={formData.total_contribution}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="total_psc" className="block text-sm font-medium text-gray-700">
              Total PSC
            </label>
            <input
              type="number"
              step="0.01"
              name="total_psc"
              id="total_psc"
              value={formData.total_psc}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
