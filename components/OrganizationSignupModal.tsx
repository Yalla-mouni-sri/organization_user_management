import React, { useState } from 'react';
import { X, Eye, EyeOff, Building2 } from 'lucide-react';

interface OrganizationSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onSwitchToLogin: () => void;
}

const OrganizationSignupModal: React.FC<OrganizationSignupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToLogin
}) => {
  const [formData, setFormData] = useState({
    organization_name: '',
    organization_email: '',
    password: '',
    confirmPassword: '',
    phone_number: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.organization_name.trim()) {
      newErrors.organization_name = 'Organization name is required';
    }
    if (!formData.organization_email.trim()) {
      newErrors.organization_email = 'Organization email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.organization_email)) {
      newErrors.organization_email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    onSubmit(submitData);
    setFormData({
      organization_name: '',
      organization_email: '',
      password: '',
      confirmPassword: '',
      phone_number: ''
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 className="modal-close-icon" style={{ color: '#2563eb' }} />
            <h2>Organization Signup</h2>
          </div>
          <button onClick={onClose} className="modal-close">
            <X className="modal-close-icon" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="organization_name">Organization Name *</label>
            <input
              type="text"
              id="organization_name"
              name="organization_name"
              value={formData.organization_name}
              onChange={handleChange}
              className={errors.organization_name ? 'form-input error' : 'form-input'}
              placeholder="Enter organization name"
            />
            {errors.organization_name && <span className="error-message">{errors.organization_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="organization_email">Organization Email *</label>
            <input
              type="email"
              id="organization_email"
              name="organization_email"
              value={formData.organization_email}
              onChange={handleChange}
              className={errors.organization_email ? 'form-input error' : 'form-input'}
              placeholder="Enter organization email"
            />
            {errors.organization_email && <span className="error-message">{errors.organization_email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number *</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={errors.phone_number ? 'form-input error' : 'form-input'}
              placeholder="Enter phone number"
            />
            {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'form-input error' : 'form-input'}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="password-icon" /> : <Eye className="password-icon" />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'form-input error' : 'form-input'}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff className="password-icon" /> : <Eye className="password-icon" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onSwitchToLogin} className="btn btn-secondary">
              Already have an account? Login
            </button>
            <button type="submit" className="btn btn-primary">
              Create Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSignupModal;

