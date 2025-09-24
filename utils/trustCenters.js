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

export function getTrustCenterByName(name) {
  const trustCenters = getAllTrustCenters();
  return trustCenters.find(tc => tc.name === name);
}

export function searchTrustCenters(query, filters = {}) {
  let trustCenters = getAllTrustCenters();

  // Apply search query
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase();
    trustCenters = trustCenters.filter(tc => 
      tc.name.toLowerCase().includes(searchTerm) ||
      tc.description.toLowerCase().includes(searchTerm)
    );
  }

  return trustCenters;
}

export function getStats() {
  const trustCenters = getAllTrustCenters();
  
  return {
    totalCompanies: trustCenters.length,
    totalIndustries: 0,
    totalCertifications: 0,
    topIndustries: [],
    topCertifications: []
  };
}
