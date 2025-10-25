# Organization & User Management System

A full-stack web application for managing organizations and their users, built with Django REST Framework backend and React frontend.

## Tech Stack

- **Backend**: Django 4.2.7 + Django REST Framework + PostgreSQL
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL

## Project Structure

```
organization_management/
├── backend/                 # Django backend
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── organizations/          # Django app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── manage.py
├── requirements.txt
└── ER_DIAGRAM.md

frontend/                   # React frontend
├── src/
│   ├── components/
│   │   ├── OrganizationList.tsx
│   │   ├── UserList.tsx
│   │   ├── OrganizationForm.tsx
│   │   └── UserForm.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   └── index.css
├── package.json
└── tailwind.config.js
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd organization_management
   pip install -r requirements.txt
   ```

2. **Setup PostgreSQL database:**
   - Create a database named `organization_management`
   - Update database credentials in `backend/settings.py` if needed

3. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start Django server:**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start React development server:**
   ```bash
   npm start
   ```
   Frontend will be available at `http://localhost:3000`

## Features

### Organizations Management
- ✅ Create, Read, Update, Delete organizations
- ✅ View organization details with user count
- ✅ Responsive table with search and pagination
- ✅ Form validation and error handling

### Users Management
- ✅ Create, Read, Update, Delete users
- ✅ Associate users with organizations
- ✅ Email validation and uniqueness
- ✅ Filter users by organization

### API Features
- ✅ RESTful API with Django REST Framework
- ✅ CORS enabled for frontend communication
- ✅ JSON serialization
- ✅ Error handling and validation

### UI Features
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Modal forms for create/edit operations
- ✅ Loading states and error handling
- ✅ Tab-based navigation
- ✅ Confirmation dialogs for delete operations

## API Endpoints

### Organizations
- `GET /api/organizations/` - List all organizations
- `GET /api/organizations/{id}/` - Get organization details
- `POST /api/organizations/` - Create new organization
- `PUT /api/organizations/{id}/` - Update organization
- `DELETE /api/organizations/{id}/` - Delete organization
- `GET /api/organizations/{id}/users/` - Get users of an organization

### Users
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `POST /api/users/` - Create new user
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

## Database Schema

See `ER_DIAGRAM.md` for detailed database schema and relationships.

## Testing

### Backend Testing
```bash
cd organization_management
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Production Deployment

1. **Backend**: Configure production database, static files, and security settings
2. **Frontend**: Build production bundle with `npm run build`
3. **Database**: Run migrations in production environment
4. **Web Server**: Configure Nginx/Apache for serving static files and proxying API requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
