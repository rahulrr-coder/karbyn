import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const LocationSelector = ({ formData, updateFormData, errors }) => {
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({
    lat: formData.basics.latitude || -3.4653,
    lng: formData.basics.longitude || -62.2159
  });
  const [mapCenter, setMapCenter] = useState(coordinates);

  // Update form data whenever coordinates change
  useEffect(() => {
    updateFormData('basics', {
      ...formData.basics,
      latitude: coordinates.lat,
      longitude: coordinates.lng
    });
  }, [coordinates]);

  const handleCoordinateChange = (field, value) => {
    const newCoordinates = { ...coordinates, [field]: parseFloat(value) || 0 };
    setCoordinates(newCoordinates);
    setMapCenter(newCoordinates);
  };

  const handleMapClick = () => {
    setShowMap(!showMap);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoordinates(newCoordinates);
          setMapCenter(newCoordinates);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your current location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Simple map click handler for coordinate selection
  const handleMapClickCoordinate = (event) => {
    // For demo purposes, we'll use a simple click-to-coordinate system
    // In production, you'd integrate with a proper map library like Leaflet or Google Maps
    const mapElement = event.currentTarget;
    const rect = mapElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simple coordinate calculation (approximate)
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    // Calculate approximate lat/lng based on current center and click position
    const latOffset = ((y - mapHeight / 2) / mapHeight) * -0.02; // Approximate scale
    const lngOffset = ((x - mapWidth / 2) / mapWidth) * 0.02;
    
    const newCoordinates = {
      lat: Math.round((mapCenter.lat + latOffset) * 10000) / 10000,
      lng: Math.round((mapCenter.lng + lngOffset) * 10000) / 10000
    };
    
    setCoordinates(newCoordinates);
  };

  // Generate sample coordinates for different regions
  const sampleLocations = [
    { name: 'Amazon Rainforest, Brazil', lat: -3.4653, lng: -62.2159 },
    { name: 'Costa Rica Forest', lat: 9.7489, lng: -83.7534 },
    { name: 'Kenya Savanna', lat: -1.2921, lng: 36.8219 },
    { name: 'Indonesia Forest', lat: -2.5489, lng: 118.0149 },
    { name: 'Madagascar', lat: -18.8792, lng: 47.5079 }
  ];

  const selectSampleLocation = (location) => {
    setCoordinates({ lat: location.lat, lng: location.lng });
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Project Coordinates</h4>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={useCurrentLocation}
            iconName="MapPin"
            iconPosition="left"
          >
            Use Current Location
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMapClick}
            iconName={showMap ? "EyeOff" : "Eye"}
            iconPosition="left"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
      </div>

      {/* Sample Locations for Quick Selection */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-foreground mb-2">Quick Location Selection</h5>
        <div className="flex flex-wrap gap-2">
          {sampleLocations.map((location, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectSampleLocation(location)}
              className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="any"
          placeholder="e.g., -3.4653"
          value={coordinates.lat}
          onChange={(e) => handleCoordinateChange('lat', e.target.value)}
          error={errors.latitude}
          description="Decimal degrees (positive for North, negative for South)"
        />
        <Input
          label="Longitude"
          type="number"
          step="any"
          placeholder="e.g., -62.2159"
          value={coordinates.lng}
          onChange={(e) => handleCoordinateChange('lng', e.target.value)}
          error={errors.longitude}
          description="Decimal degrees (positive for East, negative for West)"
        />
      </div>

      {showMap && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Map" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Project Location</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Click on map to select coordinates
              </span>
            </div>
          </div>
          <div 
            className="h-64 bg-muted/30 relative cursor-crosshair"
            onClick={handleMapClickCoordinate}
            title="Click to select coordinates"
          >
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Project Location"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=14&output=embed`}
              className="border-0 pointer-events-none"
            />
            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1">
              <span className="text-xs text-foreground font-mono">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="MapPin" size={16} className="text-accent mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Location Guidelines</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Provide the central coordinates of your project area</li>
              <li>• Use decimal degrees format (e.g., -3.4653, -62.2159)</li>
              <li>• Ensure coordinates match your project description and documentation</li>
              <li>• For large projects, use the geographic center point</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;