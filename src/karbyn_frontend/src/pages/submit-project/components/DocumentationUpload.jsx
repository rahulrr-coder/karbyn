import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentationUpload = ({ formData, updateFormData, errors }) => {
  const [dragActive, setDragActive] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const documentCategories = [
    {
      id: 'certificates',
      title: 'Certificates & Permits',
      description: 'Environmental permits, land use certificates, regulatory approvals',
      acceptedFormats: '.pdf, .jpg, .png',
      maxSize: '10MB',
      required: true,
      icon: 'Award'
    },
    {
      id: 'baseline-data',
      title: 'Baseline Data & Reports',
      description: 'Pre-project measurements, environmental assessments, scientific studies',
      acceptedFormats: '.pdf, .xlsx, .csv, .doc',
      maxSize: '25MB',
      required: true,
      icon: 'BarChart3'
    },
    {
      id: 'photos',
      title: 'Project Photos',
      description: 'Current site conditions, project activities, before/after comparisons',
      acceptedFormats: '.jpg, .png, .webp',
      maxSize: '5MB each',
      required: true,
      icon: 'Camera'
    },
    {
      id: 'methodology',
      title: 'Methodology Documents',
      description: 'Carbon calculation methods, monitoring protocols, verification plans',
      acceptedFormats: '.pdf, .doc, .xlsx',
      maxSize: '15MB',
      required: true,
      icon: 'FileText'
    },
    {
      id: 'community',
      title: 'Community Engagement',
      description: 'Stakeholder consultations, community agreements, social impact assessments',
      acceptedFormats: '.pdf, .doc, .jpg, .png',
      maxSize: '10MB',
      required: false,
      icon: 'Users'
    },
    {
      id: 'financial',
      title: 'Financial Documentation',
      description: 'Project budgets, funding sources, cost-benefit analysis',
      acceptedFormats: '.pdf, .xlsx, .doc',
      maxSize: '10MB',
      required: false,
      icon: 'DollarSign'
    }
  ];

  const handleDrag = (e, categoryId) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [categoryId]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [categoryId]: false }));
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, categoryId);
  };

  const handleFileSelect = (e, categoryId) => {
    const files = Array.from(e.target.files);
    handleFiles(files, categoryId);
  };

  const handleFiles = (files, categoryId) => {
    const currentFiles = formData.documentation[categoryId] || [];
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }));

    // Simulate upload progress
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });

    updateFormData('documentation', {
      ...formData.documentation,
      [categoryId]: [...currentFiles, ...newFiles]
    });
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
    }, 200);
  };

  const removeFile = (categoryId, fileId) => {
    const currentFiles = formData.documentation[categoryId] || [];
    const updatedFiles = currentFiles.filter(file => file.id !== fileId);
    
    updateFormData('documentation', {
      ...formData.documentation,
      [categoryId]: updatedFiles
    });

    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="Upload" size={16} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Documentation Upload</h2>
          <p className="text-sm text-muted-foreground">Upload supporting documents for project verification</p>
        </div>
      </div>

      <div className="space-y-6">
        {documentCategories.map((category) => {
          const categoryFiles = formData.documentation[category.id] || [];
          const hasError = errors[category.id];

          return (
            <div key={category.id} className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name={category.icon} size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground flex items-center space-x-2">
                      <span>{category.title}</span>
                      {category.required && <span className="text-error text-sm">*</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Formats: {category.acceptedFormats}</span>
                      <span>Max size: {category.maxSize}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center organic-transition ${
                  dragActive[category.id]
                    ? 'border-primary bg-primary/5'
                    : hasError
                    ? 'border-error bg-error/5' :'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
                onDragEnter={(e) => handleDrag(e, category.id)}
                onDragLeave={(e) => handleDrag(e, category.id)}
                onDragOver={(e) => handleDrag(e, category.id)}
                onDrop={(e) => handleDrop(e, category.id)}
              >
                <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {category.acceptedFormats} up to {category.maxSize}
                </p>
                <input
                  type="file"
                  multiple
                  accept={category.acceptedFormats.replace(/\s/g, '')}
                  onChange={(e) => handleFileSelect(e, category.id)}
                  className="hidden"
                  id={`file-${category.id}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`file-${category.id}`).click()}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Select Files
                </Button>
              </div>

              {hasError && (
                <p className="mt-2 text-sm text-error">{hasError}</p>
              )}

              {/* Uploaded Files */}
              {categoryFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-foreground">
                    Uploaded Files ({categoryFiles.length})
                  </h4>
                  <div className="space-y-2">
                    {categoryFiles.map((file) => {
                      const progress = uploadProgress[file.id] || 100;
                      const isUploading = progress < 100;

                      return (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3 flex-1">
                            <Icon name="File" size={16} className="text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{formatFileSize(file.size)}</span>
                                {isUploading && (
                                  <>
                                    <span>•</span>
                                    <span>Uploading {Math.round(progress)}%</span>
                                  </>
                                )}
                              </div>
                              {isUploading && (
                                <div className="w-full bg-border rounded-full h-1 mt-1">
                                  <div
                                    className="bg-primary h-1 rounded-full organic-transition"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(category.id, file.id)}
                            iconName="X"
                            className="text-muted-foreground hover:text-error"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Document Security & Privacy</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• All documents are encrypted and stored securely on IPFS</li>
              <li>• Sensitive information is only accessible to verified reviewers</li>
              <li>• You maintain ownership and control of your project data</li>
              <li>• Documents are used solely for project verification purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationUpload;