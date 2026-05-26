import React, { useState } from 'react';
import { ListSpaceIcon, UploadIcon, PlusIcon, TrashIcon } from '../components/Icons';
import { listingsAPI } from '../services/api';

const areas = [
  'Apas',
  'Arangkada',
  'Babag',
  'Bagnos',
  'Balamban',
  'Banilad',
  'Basak',
  'Basak Pardo',
  'Binaliw',
  'Bongol',
  'Budlaan',
  'Bulacao',
  'Busay',
  'Calape',
  'Camputhaw',
  'Capitol Site',
  'Carreta',
  'Cogon-Ramos',
  'Compostela',
  'Duljo-Fatima',
  'Dumanjug',
  'Ermita',
  'Guba',
  'Hipodromo',
  'Inayagan',
  'Kalunasan',
  'Kamputhaw',
  'Kinasang-an',
  'Labangon',
  'Lahug',
  'Luyang',
  'Mabini',
  'Mabolo',
  'Malubog',
  'Mambaling',
  'Pambujan',
  'Pardo',
  'Pit-os',
  'Poblacion',
  'Punta Princesa',
  'Sapangdako',
  'Sirao',
  'Sudlon',
  'Sum-ag',
  'T. Padilla',
  'Tabunan',
  'Talamban',
  'Taptap',
  'Tejero',
  'Tinago',
  'Tisa',
  'To-ong',
  'Trinidad',
  'Zapatera'
];

function ListYourSpace({ onSubmit, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    area: '',
    description: '',
    slots: '1',
    hourlyRate: '',
    dailyRate: '',
    amenities: {
      cctv: false,
      covered: false,
      evCharging: false,
      handicapAccessible: false,
      security: false,
      lighting: false,
      gate: false,
      attendant: false
    },
    schedule: [
      { days: 'Monday-Friday', startTime: '08:00', endTime: '17:00' }
    ],
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: !prev.amenities[amenity] }
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { days: '', startTime: '08:00', endTime: '17:00' }]
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      showToast('You can only upload up to 5 photos');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.slots || !formData.hourlyRate) {
      showToast('Please fill in all required fields');
      return;
    }

    try {
      const result = await listingsAPI.create({
        name: formData.name,
        address: formData.address,
        description: formData.description,
        price_per_hour: parseFloat(formData.hourlyRate),
        total_slots: parseInt(formData.slots),
        amenities: formData.amenities,
        rules: '',
      });

      showToast('Your parking space has been submitted for review!');
      // reset form as before...
    } catch (err) {
      showToast('Failed to submit listing: ' + err.message);
    }

    const listingData = {
      name: formData.name,
      address: formData.address,
      area: formData.area,
      description: formData.description,
      slots: parseInt(formData.slots),
      hourlyRate: parseFloat(formData.hourlyRate),
      dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : null,
      amenities: formData.amenities,
      schedule: formData.schedule,
      images: formData.images,
      status: 'pending',
      owner: 'Current User'
    };

    onSubmit(listingData);

    // Reset form
    setFormData({
      name: '',
      address: '',
      area: '',
      description: '',
      slots: '1',
      hourlyRate: '',
      dailyRate: '',
      amenities: {
        cctv: false,
        covered: false,
        evCharging: false,
        handicapAccessible: false,
        security: false,
        lighting: false,
        gate: false,
        attendant: false
      },
      schedule: [
        { days: 'Monday-Friday', startTime: '08:00', endTime: '17:00' }
      ],
      images: []
    });
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <ListSpaceIcon />
            <h1 className="page-title">List Your Parking Space</h1>
        </div>
        <div className="page-header-right">
          <span className="page-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="list-space-container">
        <div className="list-space-intro">
          <h2>Start earning from your unused driveway or parking lot</h2>
        </div>

        <form className="list-space-form" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Basic Information</h3>
              <p className="form-section-desc">Provide details about your parking space</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Space Name<span className="required">*</span></label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., IT Park Premium Lot"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Address<span className="required">*</span></label>
              <input 
                type="text" 
                name="address"
                className="form-input" 
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, Barangay"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Area<span className="required">*</span></label>
              <select 
                name="area"
                className="form-input form-select" 
                value={formData.area}
                onChange={handleChange}
                required
              >
                <option value="">Select area</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                name="description"
                className="form-input form-textarea" 
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your parking space, access instructions, nearby landmarks..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Slots<span className="required">*</span></label>
              <input 
                type="number" 
                name="slots"
                className="form-input" 
                value={formData.slots}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Pricing (CCTO Compliant)</h3>
              <p className="form-section-desc">Set your rates according to City Ordinance 2087</p>
            </div>
            
            <div className="ccto-guidelines">
              <span className="ccto-icon">ℹ️</span>
              <p><strong>CCTO Guidelines:</strong> Hourly rates should range between ₱25-₱60 to maintain fair pricing standards in Cebu City.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hourly Rate (₱)</label>
                <input 
                  type="number" 
                  name="hourlyRate"
                  className="form-input" 
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Daily Rate (₱)</label>
                <input 
                  type="number" 
                  name="dailyRate"
                  className="form-input" 
                  value={formData.dailyRate}
                  onChange={handleChange}
                  placeholder="300"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Features & Amenities Section */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Features & Amenities</h3>
              <p className="form-section-desc">What makes your parking space stand out?</p>
            </div>
            
            <div className="amenities-grid">
              {[
                { key: 'cctv', label: 'CCTV Surveillance', icon: '📹' },
                { key: 'covered', label: 'Covered Parking', icon: '🏠' },
                { key: 'lighting', label: 'Good Lighting', icon: '💡' },
                { key: 'security', label: '24/7 Security', icon: '👮' },
                { key: 'gate', label: 'Gated Entry', icon: '🚪' },
                { key: 'attendant', label: 'On-site Attendant', icon: '🧑‍💼' },
                { key: 'evCharging', label: 'EV Charging Station', icon: '⚡' },
                { key: 'handicapAccessible', label: 'Handicap Accessible', icon: '♿' }
              ].map(amenity => (
                <label key={amenity.key} className={`amenity-checkbox ${formData.amenities[amenity.key] ? 'checked' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={formData.amenities[amenity.key]}
                    onChange={() => handleAmenityChange(amenity.key)}
                  />
                  <span className="amenity-icon">{amenity.icon}</span>
                  <span className="amenity-label">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Schedule Section */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Availability Schedule</h3>
              <p className="form-section-desc">Set when your parking space is available</p>
            </div>
            
            <div className="schedule-list">
              {formData.schedule.map((slot, index) => (
                <div key={index} className="schedule-item">
                  <div className="schedule-row">
                    <div className="form-group schedule-days">
                      <input 
                        type="text"
                        className="form-input"
                        value={slot.days}
                        onChange={(e) => updateTimeSlot(index, 'days', e.target.value)}
                        placeholder="e.g., Monday-Friday"
                      />
                    </div>
                    <div className="form-group schedule-time">
                      <label className="form-label-small">From</label>
                      <input 
                        type="time"
                        className="form-input"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      />
                    </div>
                    <div className="form-group schedule-time">
                      <label className="form-label-small">To</label>
                      <input 
                        type="time"
                        className="form-input"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      />
                    </div>
                    {formData.schedule.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-icon btn-delete"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              className="btn-add-slot"
              onClick={addTimeSlot}
            >
              <PlusIcon /> Add Time Slot
            </button>
          </div>

          {/* Photos Section */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Photos</h3>
              <p className="form-section-desc">Upload photos of your parking space (recommended)</p>
            </div>
            
            <div className="photo-upload-area">
              <input 
                type="file" 
                id="photo-upload"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload" className="upload-button">
                <UploadIcon />
                <span>Click to upload photos</span>
                <span className="upload-hint">Upload up to 5 photos (JPG, PNG)</span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="photo-preview-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="photo-preview-item">
                    <img src={image.preview} alt={image.name} />
                    <button 
                      type="button"
                      className="btn-remove-photo"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              List Parking Space
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ListYourSpace;