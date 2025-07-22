import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ProjectDocumentation = ({ project }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const documentCategories = [
    { id: 'all', label: 'All Documents', count: 24 },
    { id: 'certificates', label: 'Certificates', count: 6 },
    { id: 'reports', label: 'Reports', count: 8 },
    { id: 'photos', label: 'Photos', count: 10 }
  ];

  const documents = [
    {
      id: 1,
      name: "Environmental Impact Assessment Report",
      type: "PDF",
      category: "reports",
      size: "2.4 MB",
      uploadDate: "2024-06-15",
      description: "Comprehensive analysis of environmental impact and carbon sequestration potential",
      verified: true,
      downloadUrl: "#"
    },
    {
      id: 2,
      name: "VCS Certification Document",
      type: "PDF",
      category: "certificates",
      size: "1.8 MB",
      uploadDate: "2024-06-10",
      description: "Verified Carbon Standard certification for the reforestation project",
      verified: true,
      downloadUrl: "#"
    },
    {
      id: 3,
      name: "Project Site Before Photos",
      type: "ZIP",
      category: "photos",
      size: "15.2 MB",
      uploadDate: "2024-05-20",
      description: "Baseline photography documenting site conditions before project implementation",
      verified: true,
      downloadUrl: "#"
    },
    {
      id: 4,
      name: "Soil Analysis Report",
      type: "PDF",
      category: "reports",
      size: "3.1 MB",
      uploadDate: "2024-06-08",
      description: "Detailed soil composition and carbon content analysis",
      verified: true,
      downloadUrl: "#"
    },
    {
      id: 5,
      name: "Community Engagement Documentation",
      type: "PDF",
      category: "reports",
      size: "4.7 MB",
      uploadDate: "2024-06-12",
      description: "Records of community meetings, agreements, and participation metrics",
      verified: false,
      downloadUrl: "#"
    },
    {
      id: 6,
      name: "Progress Photos - Month 6",
      type: "ZIP",
      category: "photos",
      size: "22.8 MB",
      uploadDate: "2024-06-18",
      description: "Current site conditions showing tree growth and project progress",
      verified: true,
      downloadUrl: "#"
    }
  ];

  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'FileText';
      case 'zip': return 'Archive';
      case 'jpg': case'png': return 'Image';
      default: return 'File';
    }
  };

  return (
    <div className="space-y-8">
      {/* Document Categories */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Project Documentation
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {documentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium organic-transition ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-surface rounded-lg p-6 organic-shadow-subtle">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name={getFileIcon(document.type)} size={20} color="white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {document.type}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {document.size}
                  </div>
                </div>
              </div>
              {document.verified && (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              )}
            </div>

            <h4 className="font-medium text-foreground mb-2 line-clamp-2">
              {document.name}
            </h4>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {document.description}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Uploaded {document.uploadDate}</span>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => window.open(document.downloadUrl, '_blank')}
                className="flex-1"
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                onClick={() => setSelectedDocument(document)}
              >
                Preview
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Standards */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Verification Standards
        </h3>
        <div className="bg-surface rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Certification Bodies
              </h4>
              <div className="space-y-3">
                {project.certificationBodies.map((body, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                      <Icon name="Award" size={16} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {body.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {body.standard}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Document Requirements
              </h4>
              <div className="space-y-2">
                {project.documentRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Guidelines */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Document Upload Guidelines
        </h3>
        <div className="bg-surface rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name="FileCheck" size={24} color="white" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                Accepted Formats
              </h4>
              <p className="text-sm text-muted-foreground">
                PDF, DOC, JPG, PNG, ZIP files up to 50MB
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name="Shield" size={24} color="white" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                Verification Process
              </h4>
              <p className="text-sm text-muted-foreground">
                All documents reviewed by certified validators
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" size={24} color="white" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                Review Timeline
              </h4>
              <p className="text-sm text-muted-foreground">
                Typically 3-5 business days for verification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {selectedDocument.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedDocument(null)}
              />
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Document preview not available
                </p>
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => window.open(selectedDocument.downloadUrl, '_blank')}
                >
                  Download to View
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDocumentation;