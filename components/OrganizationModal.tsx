import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Organization {
  id?: number;
  name: string;
  address: string;
}

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Organization) => void;
  organization?: Organization | null;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  organization
}) => {
  const [formData, setFormData] = useState<Organization>({
    name: organization?.name || '',
    address: organization?.address || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({ name: '', address: '' });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{organization ? 'Edit Organization' : 'Add Organization'}</h2>
          <button onClick={onClose} className="modal-close">
            <X className="modal-close-icon" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Organization Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'form-input error' : 'form-input'}
              placeholder="Enter organization name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'form-textarea error' : 'form-textarea'}
              placeholder="Enter organization address"
              rows={3}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {organization ? 'Update Organization' : 'Add Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationModal;

