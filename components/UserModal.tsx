import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
}

interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: number;
  position?: string;
  phone_number?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: User) => void;
  user?: User | null;
  organizations: Organization[];
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  organizations
}) => {
  const [formData, setFormData] = useState<User>({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    organization: user?.organization || (organizations[0]?.id || 0),
    position: user?.position || '',
    phone_number: user?.phone_number || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.organization) {
      newErrors.organization = 'Please select an organization';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({ 
      username: '', 
      email: '', 
      first_name: '', 
      last_name: '', 
      organization: organizations[0]?.id || 0,
      position: '',
      phone_number: ''
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'organization' ? parseInt(value) : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} className="modal-close">
            <X className="modal-close-icon" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'form-input error' : 'form-input'}
                placeholder="Enter first name"
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'form-input error' : 'form-input'}
                placeholder="Enter last name"
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'form-input error' : 'form-input'}
                placeholder="Enter username"
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'form-input error' : 'form-input'}
                placeholder="Enter user email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="organization">Organization *</label>
            <select
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className={errors.organization ? 'form-select error' : 'form-select'}
            >
              <option value={0}>Select an organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            {errors.organization && <span className="error-message">{errors.organization}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter position/role"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

