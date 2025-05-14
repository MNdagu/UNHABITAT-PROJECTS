import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, deleteProject } from "../services/api";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSizeOptions = [5, 10, 20, 50, "All"];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects(
          currentPage,
          pageSize === "All" ? 1000 : pageSize
        );
        setProjects(data.results || data);
        setTotalPages(
          Math.ceil(
            (data.count || data.length) / (pageSize === "All" ? 1 : pageSize)
          )
        );
        setTotalItems(data.count || data.length);
        setLoading(false);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
        setLoading(false);
      }
    };

    loadProjects();
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = e.target.value;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleDelete = async (id, projectTitle) => {
    if (
      window.confirm(
        `Are you sure you want to delete project "${projectTitle}"? This action cannot be undone.`
      )
    ) {
      try {
        setIsDeleting(true);
        await deleteProject(id);
        // Refresh the projects list
        const data = await fetchProjects(
          currentPage,
          pageSize === "All" ? 1000 : pageSize
        );
        setProjects(data.results || data);
        setTotalPages(
          Math.ceil(
            (data.count || data.length) / (pageSize === "All" ? 1 : pageSize)
          )
        );
        setTotalItems(data.count || data.length);
        setIsDeleting(false);
      } catch (err) {
        setError("Failed to delete project. Please try again later.");
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-full">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <Link
          to="/projects/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add New Project
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Title
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Country
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Start Date
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                End Date
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.project_id} className="hover:bg-gray-50">
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.project_id}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500 truncate">
                  {project.project_title}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                  {project.country_name}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.approval_status_name === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.approval_status_name}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                  {project.start_date}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                  {project.end_date}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/projects/${project.project_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/projects/${project.project_id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(project.project_id, project.project_title)
                      }
                      className="text-red-600 hover:text-red-900"
                      disabled={isDeleting}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages} ({totalItems} items)
            </span>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-4"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
