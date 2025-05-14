# UN-Habitat Projects Management System

A comprehensive web-based application for managing UN-Habitat projects with CRUD operations, data visualization, and API endpoints.

## Application Overview

The UN-Habitat Projects Management System is designed to help manage and visualize project data. It provides a user-friendly interface for project management with the following capabilities:

## Features

- **Project Management**: Complete CRUD (Create, Read, Update, Delete) operations for projects
- **Tabular Display**: View projects in a paginated table with customizable rows per page
- **API Endpoints**: Access project data via RESTful API endpoints for integration with other systems
- **Data Visualization**: Interactive dashboard with charts showing project distribution by country, lead organization unit, and theme
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technology Stack

### Backend
- **Django 4.x**: Python web framework for rapid development
- **Django REST Framework**: Toolkit for building Web APIs
- **SQLite Database**: Lightweight database for data storage
- **Django Management Commands**: Custom commands for data import and management

### Frontend
- **React 18.x**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Recharts**: Composable charting library for data visualization
- **React Router**: Navigation and routing for the single-page application
- **Axios**: Promise-based HTTP client for API requests

## Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+**: Required for the Django backend
- **Node.js 16.x+**: Required for the React frontend
- **npm 8.x+**: Package manager for JavaScript
- **Git**: Version control system (optional, for cloning the repository)

## Installation and Setup

### 1. Clone the Repository (Optional)

```bash
git clone https://github.com/yourusername/unhabitatproject.git
cd unhabitatproject
```

### 2. Backend Setup

#### a. Navigate to the backend directory:
```bash
cd backend
```

#### b. Create and activate a virtual environment:
```bash
# Using venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Or using pipenv
pipenv install
pipenv shell
```

#### c. Install required Python packages:
```bash
pip install django djangorestframework django-cors-headers
```

#### d. Navigate to the Django project directory:
```bash
cd unhabitat
```

#### e. Apply migrations to create the database schema:
```bash
python manage.py makemigrations projects
python manage.py migrate
```

### 3. Data Import

The project includes a custom Django management command for importing project data from a tab-separated text file.

#### a. Verify the projects.txt file:
Ensure the `projects.txt` file is in the root directory of the project.

#### b. Run the import command:
```bash
python manage.py import_projects_txt
```

### 4. Backend Configuration

The project is already configured with the necessary settings for CORS (Cross-Origin Resource Sharing) and REST Framework in `unhabitat/settings.py`.

### 5. Start the Django Backend Server

```bash
python manage.py runserver
```

The backend server will be running at http://localhost:8000/

### 6. Frontend Setup

#### a. Navigate to the frontend directory:

#### b. Install Node.js dependencies:
```bash
npm install
```

#### c. Start the development server:
```bash
npm run dev
```

The frontend application will be running at http://localhost:5173/

### Using the API Endpoints
The following API endpoints are available:

- **All Projects**: `http://localhost:8000/api/projects/all/`
- **Projects by Country**: `http://localhost:8000/api/projects/country/{country_name}/`
- **Projects by Approval Status**: `http://localhost:8000/api/projects/approval-status/{status_name}/`
- **Dashboard Data**: `http://localhost:8000/api/dashboard/`


### Potential Issues

1. **Database Migration Issues**:
   - Ensure all migrations are applied with `python manage.py migrate`
   - If you encounter errors, try resetting migrations with `python manage.py migrate projects zero` and then `python manage.py makemigrations projects` followed by `python manage.py migrate`

