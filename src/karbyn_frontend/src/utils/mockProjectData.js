/**
 * Mock project data for testing the project submission form
 */

// Sample project data
export const sampleProjectData = {
  basics: {
    name: "Amazon Rainforest Conservation Initiative",
    type: "reforestation",
    region: "south-america",
    location: "Acre State, Brazil",
    description: "This project aims to protect and restore 5,000 hectares of Amazon rainforest through sustainable forestry practices and community engagement. Working with local indigenous communities, we will plant native tree species, establish conservation zones, and implement monitoring systems to prevent illegal logging. The project will focus on high-biodiversity areas and create sustainable livelihoods for local communities while sequestering carbon dioxide.",
    carbonImpact: "25000",
    latitude: "-9.0238",
    longitude: "-70.8120"
  },
  impact: {
    standard: "vcs",
    monitoringFrequency: "quarterly",
    measurementTools: [
      "satellite-monitoring", 
      "field-measurements", 
      "community-reporting"
    ],
    photos: [],
    certificates: []
  },
  review: {
    acceptedTerms: true,
    acceptedPrivacy: true
  }
};

// Alternative sample projects for variety
export const alternativeProjects = [
  {
    basics: {
      name: "Solar Microgrid for Rural Communities",
      type: "renewable-energy",
      region: "africa",
      location: "Nairobi County, Kenya",
      description: "Implementation of solar microgrids across 15 rural villages currently without electricity access. This project will provide clean energy to approximately 5,000 households, replacing kerosene lamps and diesel generators with renewable solar power, significantly reducing carbon emissions while improving quality of life and enabling economic development.",
      carbonImpact: "12500",
      latitude: "-1.2921",
      longitude: "36.8219"
    },
    impact: {
      standard: "gold-standard",
      monitoringFrequency: "monthly",
      measurementTools: [
        "energy-meters", 
        "community-reporting"
      ]
    }
  },
  {
    basics: {
      name: "Mangrove Restoration Project",
      type: "conservation",
      region: "asia",
      location: "Sundarbans, Bangladesh",
      description: "Restoration of 2,000 hectares of degraded mangrove ecosystems in the Sundarbans region. Mangroves are among the most carbon-dense forests in the tropics, sequestering carbon at rates up to four times higher than mature tropical forests. This project will restore critical coastal habitats, protect communities from storm surges, and create sustainable livelihoods through eco-tourism and sustainable fishing practices.",
      carbonImpact: "18000",
      latitude: "21.9497",
      longitude: "89.1833"
    },
    impact: {
      standard: "american-carbon-registry",
      monitoringFrequency: "quarterly",
      measurementTools: [
        "satellite-monitoring", 
        "field-measurements", 
        "drone-surveys"
      ]
    }
  }
];

// Create mock file objects for photos
const createMockFileObject = (url, filename, type) => {
  return {
    name: filename,
    size: Math.floor(Math.random() * 5000000) + 1000000, // Random size between 1-6MB
    type: type,
    url: url,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};

// Sample image URLs for testing
export const sampleImageUrls = [
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564053489984-317bbd824340?q=80&w=1000&auto=format&fit=crop"
];

// Sample certificate names
export const sampleCertificates = [
  "VCS_Validation_Report.pdf",
  "Community_Impact_Assessment.docx",
  "Carbon_Baseline_Calculation.xlsx"
];

/**
 * Fill the form with sample data
 * @param {Function} updateFormData - Function to update form data
 * @param {boolean} includeFiles - Whether to include mock files
 * @param {number} projectIndex - Index of the project to use (0 = default, 1-2 = alternatives)
 */
export const fillFormWithSampleData = (updateFormData, includeFiles = true, projectIndex = 0) => {
  let projectData;
  
  // Select the project data based on index
  if (projectIndex === 0) {
    projectData = sampleProjectData;
  } else {
    projectData = alternativeProjects[Math.min(projectIndex - 1, alternativeProjects.length - 1)];
  }
  
  // Fill basic project information
  updateFormData('basics', projectData.basics);
  
  // Create impact data
  const impactData = {
    ...projectData.impact,
    photos: [],
    certificates: []
  };
  
  // Add mock photos if requested
  if (includeFiles) {
    // Add mock photos
    impactData.photos = [
      createMockFileObject(
        sampleImageUrls[0], 
        'project-site-overview.jpg', 
        'image/jpeg'
      ),
      createMockFileObject(
        sampleImageUrls[1], 
        'community-engagement.jpg', 
        'image/jpeg'
      )
    ];
    
    // Add mock certificates
    impactData.certificates = [
      createMockFileObject(
        '', 
        sampleCertificates[0], 
        'application/pdf'
      )
    ];
  }
  
  // Fill impact methodology information
  updateFormData('impact', impactData);
  
  // Fill review information
  updateFormData('review', {
    acceptedTerms: true,
    acceptedPrivacy: true
  });
  
  console.log("Form filled with sample data!", projectData);
  return "Form filled with sample data!";
};

export default {
  sampleProjectData,
  alternativeProjects,
  sampleImageUrls,
  sampleCertificates,
  fillFormWithSampleData,
  createMockFileObject
};
