// Import all trust center data
import stripe from '../constants/trustCenterRegistry/stripe.js';
import github from '../constants/trustCenterRegistry/github.js';
import salesforce from '../constants/trustCenterRegistry/salesforce.js';

const trustCenterData = [
  stripe,
  github, 
  salesforce
];

export function getAllTrustCenters() {
  // Sort by name
  return trustCenterData.sort((a, b) => a.name.localeCompare(b.name));
}

export function getTrustCenterBySlug(slug) {
  const trustCenters = getAllTrustCenters();
  return trustCenters.find(tc => tc.slug === slug);
}

export function getTrustCentersByIndustry(industry) {
  const trustCenters = getAllTrustCenters();
  return trustCenters.filter(tc => tc.industry === industry);
}

export function getTrustCentersByCertification(certification) {
  const trustCenters = getAllTrustCenters();
  return trustCenters.filter(tc => tc.certifications.includes(certification));
}

export function searchTrustCenters(query, filters = {}) {
  let trustCenters = getAllTrustCenters();

  // Apply filters
  if (filters.industry && filters.industry !== 'all') {
    trustCenters = trustCenters.filter(tc => tc.industry === filters.industry);
  }

  if (filters.certification && filters.certification !== 'all') {
    trustCenters = trustCenters.filter(tc => 
      tc.certifications.includes(filters.certification)
    );
  }

  if (filters.framework && filters.framework !== 'all') {
    trustCenters = trustCenters.filter(tc => 
      tc.frameworks.includes(filters.framework)
    );
  }

  if (filters.companySize && filters.companySize !== 'all') {
    trustCenters = trustCenters.filter(tc => tc.employees === filters.companySize);
  }

  // Apply search query
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase();
    trustCenters = trustCenters.filter(tc => 
      tc.name.toLowerCase().includes(searchTerm) ||
      tc.industry.toLowerCase().includes(searchTerm) ||
      tc.description.toLowerCase().includes(searchTerm) ||
      tc.certifications.some(cert => cert.toLowerCase().includes(searchTerm)) ||
      tc.frameworks.some(framework => framework.toLowerCase().includes(searchTerm))
    );
  }

  return trustCenters;
}

export function getUniqueIndustries() {
  const trustCenters = getAllTrustCenters();
  const industries = [...new Set(trustCenters.map(tc => tc.industry))];
  return industries.sort();
}

export function getUniqueCertifications() {
  const trustCenters = getAllTrustCenters();
  const certifications = new Set();
  
  trustCenters.forEach(tc => {
    tc.certifications.forEach(cert => certifications.add(cert));
  });
  
  return Array.from(certifications).sort();
}

export function getUniqueFrameworks() {
  const trustCenters = getAllTrustCenters();
  const frameworks = new Set();
  
  trustCenters.forEach(tc => {
    tc.frameworks.forEach(framework => frameworks.add(framework));
  });
  
  return Array.from(frameworks).sort();
}

export function getStats() {
  const trustCenters = getAllTrustCenters();
  const industries = getUniqueIndustries();
  const certifications = getUniqueCertifications();
  
  return {
    totalCompanies: trustCenters.length,
    totalIndustries: industries.length,
    totalCertifications: certifications.length,
    topIndustries: industries.slice(0, 5),
    topCertifications: certifications.slice(0, 5)
  };
}
