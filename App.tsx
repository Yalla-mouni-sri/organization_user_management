import React, { useState, useEffect } from 'react';
import { Building2, Users, Plus, Edit, Trash2, UserPlus, LogOut, ArrowLeft } from 'lucide-react';
import { organizationsApi, usersApi, authApi } from './services/api';
import OrganizationModal from './components/OrganizationModal';
import UserModal from './components/UserModal';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import OrganizationSignupModal from './components/OrganizationSignupModal';
import UserRegistrationModal from './components/UserRegistrationModal';

interface Organization {
  id: number;
  name: string;
  address: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: number;
  organization_name: string;
  position?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: number;
  organization_name: string;
}

type AppView = 'main' | 'organizations' | 'users';

function App() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [activeTab, setActiveTab] = useState<'organizations' | 'users'>('organizations');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showOrgSignupModal, setShowOrgSignupModal] = useState(false);
  const [showUserRegistrationModal, setShowUserRegistrationModal] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    fetchData();
  }, []);

  // Navigation handlers
  const handleOrganizationClick = () => {
    if (isAuthenticated) {
      setCurrentView('organizations');
    } else {
      setShowOrgSignupModal(true);
    }
  };

  const handleUsersClick = () => {
    setCurrentView('users');
  };

  const handleUserRegistrationClick = () => {
    setShowUserRegistrationModal(true);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setActiveTab('organizations');
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await authApi.profile();
        setAuthUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setAuthUser(null);
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orgsResponse, usersResponse] = await Promise.all([
        organizationsApi.getAll(),
        usersApi.getAll()
      ]);
      setOrganizations(orgsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSubmit = async (formData: any) => {
    try {
      if (editingOrg) {
        await organizationsApi.update(editingOrg.id, formData);
      } else {
        await organizationsApi.create(formData);
      }
      fetchData();
      setShowOrgModal(false);
      setEditingOrg(null);
    } catch (error) {
      console.error('Error saving organization:', error);
      alert('Error saving organization. Please try again.');
    }
  };

  const handleUserSubmit = async (formData: any) => {
    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, formData);
      } else {
        await usersApi.create(formData);
      }
      fetchData();
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    }
  };

  const handleDeleteOrg = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await organizationsApi.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersApi.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Authentication handlers
  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const response = await authApi.login(data);
      localStorage.setItem('authToken', response.data.token);
      setAuthUser(response.data.user);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setCurrentView('organizations');
      alert('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (data: any) => {
    try {
      const response = await authApi.signup(data);
      localStorage.setItem('authToken', response.data.token);
      setAuthUser(response.data.user);
      setIsAuthenticated(true);
      setShowSignupModal(false);
      setCurrentView('organizations');
      alert('Registration successful!');
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  const handleOrgSignup = async (data: any) => {
    try {
      // Use the organization signup endpoint directly
      const response = await authApi.signup(data);
      setShowOrgSignupModal(false);
      alert('Organization created successfully! Please login to continue.');
    } catch (error: any) {
      console.error('Organization signup error:', error);
      
      // Handle different error response formats
      let errorMessage = 'Organization creation failed. Please try again.';
      
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'object') {
          // Handle validation errors from serializer
          const errors = Object.values(error.response.data).flat();
          errorMessage = errors.join(', ');
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleUserRegistration = async (data: any) => {
    try {
      const response = await authApi.userRegistration(data);
      setShowUserRegistrationModal(false);
      alert('User registered successfully to organization!');
      fetchData(); // Refresh the data to show the new user
    } catch (error: any) {
      console.error('User registration error:', error);
      
      // Handle different error response formats
      let errorMessage = 'User registration failed. Please try again.';
      
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'object') {
          // Handle validation errors from serializer
          const errors = Object.values(error.response.data).flat();
          errorMessage = errors.join(', ');
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setAuthUser(null);
      setCurrentView('main');
      alert('Logged out successfully!');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Main Landing Page
  if (currentView === 'main') {
    return (
      <div>
        {/* Header */}
        <header className="auth-header">
          <div className="container">
            <div className="auth-header-content">
              <div className="auth-logo">
                <Building2 className="auth-logo-icon" />
                <h1 className="auth-logo-text">
                  Organization Management System
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            <div className="landing-page">
              <div className="landing-content">
                <h2 className="landing-title">Welcome to Organization Management</h2>
                <p className="landing-description">
                  Choose your access level to continue
                </p>
                
                <div className="access-buttons">
                  <button
                    onClick={handleOrganizationClick}
                    className="access-btn organization-btn"
                  >
                    <Building2 className="btn-icon" />
                    <div className="btn-content">
                      <h3>Organization Access</h3>
                      <p>Create your organization and manage users (Signup Required)</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleUserRegistrationClick}
                    className="access-btn user-registration-btn"
                  >
                    <UserPlus className="btn-icon" />
                    <div className="btn-content">
                      <h3>Registration of User to Respective Organization</h3>
                      <p>Join an existing organization as a user</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleUsersClick}
                    className="access-btn users-btn"
                  >
                    <Users className="btn-icon" />
                    <div className="btn-content">
                      <h3>Users View</h3>
                      <p>View users and organizations (No Authentication Required)</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Authentication Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />

        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onSubmit={handleSignup}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          organizations={organizations}
        />

        <OrganizationSignupModal
          isOpen={showOrgSignupModal}
          onClose={() => setShowOrgSignupModal(false)}
          onSubmit={handleOrgSignup}
          onSwitchToLogin={() => {
            setShowOrgSignupModal(false);
            setShowLoginModal(true);
          }}
        />

        <UserRegistrationModal
          isOpen={showUserRegistrationModal}
          onClose={() => setShowUserRegistrationModal(false)}
          onSubmit={handleUserRegistration}
        />
      </div>
    );
  }

  // Organizations View (Authenticated)
  if (currentView === 'organizations') {
    return (
      <div>
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <Building2 className="logo-icon" />
                <h1 className="logo-text">
                  Organization Management System
                </h1>
              </div>
              <div className="tabs">
                <button
                  onClick={() => setActiveTab('organizations')}
                  className={`tab ${activeTab === 'organizations' ? 'active' : ''}`}
                >
                  Organizations
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                >
                  Users
                </button>
              </div>
            </div>
            {authUser && (
              <div className="auth-user-info">
                <div>
                  <div className="auth-user-name">
                    {authUser.first_name} {authUser.last_name}
                  </div>
                  <div className="auth-org-name">
                    {authUser.organization_name}
                  </div>
                </div>
                <div className="header-actions">
                  <button
                    onClick={handleBackToMain}
                    className="btn btn-secondary"
                  >
                    <ArrowLeft className="btn-icon" />
                    Back to Main
                  </button>
                  <button
                    onClick={handleLogout}
                    className="auth-logout-btn"
                  >
                    <LogOut className="btn-icon" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            {activeTab === 'organizations' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Organizations</h2>
                  <button
                    onClick={() => {
                      setEditingOrg(null);
                      setShowOrgModal(true);
                    }}
                    className="btn btn-primary"
                  >
                    <Plus className="btn-icon" />
                    Add Organization
                  </button>
                </div>

                <div className="cards-grid">
                  {organizations.map((org) => (
                    <div key={org.id} className="card">
                      <div className="card-header">
                        <Building2 className="card-icon" />
                        <div className="card-actions">
                          <button
                            onClick={() => {
                              setEditingOrg(org);
                              setShowOrgModal(true);
                            }}
                            className="action-btn"
                          >
                            <Edit className="btn-icon" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrg(org.id)}
                            className="action-btn delete"
                          >
                            <Trash2 className="btn-icon" />
                          </button>
                        </div>
                      </div>
                      <h3 className="card-title">{org.name}</h3>
                      <p className="card-description">{org.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Users</h2>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setShowUserModal(true);
                    }}
                    className="btn btn-primary"
                  >
                    <UserPlus className="btn-icon" />
                    Add User
                  </button>
                </div>

                <div className="table-container">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Organization</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info">
                              <Users className="user-icon" />
                              <div className="user-name">{user.first_name} {user.last_name}</div>
                            </div>
                          </td>
                          <td className="user-email">
                            {user.email}
                          </td>
                          <td className="user-org">
                            {organizations.find(org => org.id === user.organization)?.name || 'Unknown'}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowUserModal(true);
                                }}
                                className="edit-btn"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="delete-btn"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <OrganizationModal
          isOpen={showOrgModal}
          onClose={() => {
            setShowOrgModal(false);
            setEditingOrg(null);
          }}
          onSubmit={handleOrgSubmit}
          organization={editingOrg}
        />

        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSubmit={handleUserSubmit}
          user={editingUser}
          organizations={organizations}
        />
      </div>
    );
  }

  // Users View (Enhanced for registered users)
  if (currentView === 'users') {
    return (
      <div>
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <Users className="logo-icon" />
                <h1 className="logo-text">
                  Users Directory
                </h1>
              </div>
              <div className="header-actions">
                {isAuthenticated && authUser && (
                  <div className="auth-user-info">
                    <div>
                      <div className="auth-user-name">
                        {authUser.first_name} {authUser.last_name}
                      </div>
                      <div className="auth-org-name">
                        {authUser.organization_name}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="auth-logout-btn"
                    >
                      <LogOut className="btn-icon" />
                      Logout
                    </button>
                  </div>
                )}
                <button
                  onClick={handleBackToMain}
                  className="btn btn-secondary"
                >
                  <ArrowLeft className="btn-icon" />
                  Back to Main
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {isAuthenticated ? 'All Users Directory' : 'Public Users Directory'}
              </h2>
              <p className="section-description">
                {isAuthenticated 
                  ? `Welcome ${authUser?.first_name}! View all users across organizations` 
                  : 'View all users across organizations (No Authentication Required)'
                }
              </p>
            </div>

            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Position</th>
                    <th>Phone</th>
                    <th>Created</th>
                    {isAuthenticated && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody className="table-body">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <Users className="user-icon" />
                          <div className="user-name">{user.first_name} {user.last_name}</div>
                        </div>
                      </td>
                      <td className="user-email">
                        {user.email}
                      </td>
                      <td className="user-org">
                        {user.organization_name}
                      </td>
                      <td className="user-position">
                        {user.position || 'N/A'}
                      </td>
                      <td className="user-phone">
                        {user.phone_number || 'N/A'}
                      </td>
                      <td className="user-date">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      {isAuthenticated && (
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserModal(true);
                              }}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAuthenticated && (
              <div className="section-header" style={{ marginTop: '2rem' }}>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setShowUserModal(true);
                  }}
                  className="btn btn-primary"
                >
                  <UserPlus className="btn-icon" />
                  Add New User
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Modals for authenticated users */}
        {isAuthenticated && (
          <>
            <UserModal
              isOpen={showUserModal}
              onClose={() => {
                setShowUserModal(false);
                setEditingUser(null);
              }}
              onSubmit={handleUserSubmit}
              user={editingUser}
              organizations={organizations}
            />
          </>
        )}
      </div>
    );
  }

  return null;
}

export default App;
