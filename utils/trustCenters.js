// Auto-generated imports - DO NOT EDIT MANUALLY
// This file is automatically updated by generate-utils.js
import amazon_aws from '../constants/trustCenterRegistry/amazon_aws.js';
import betterment from '../constants/trustCenterRegistry/betterment.js';
import coderabbit from '../constants/trustCenterRegistry/coderabbit.js';
import cursor from '../constants/trustCenterRegistry/cursor.js';
import delve from '../constants/trustCenterRegistry/delve.js';
import drata from '../constants/trustCenterRegistry/drata.js';
import eudia from '../constants/trustCenterRegistry/eudia.js';
import figma from '../constants/trustCenterRegistry/figma.js';
import github from '../constants/trustCenterRegistry/github.js';
import gitlab from '../constants/trustCenterRegistry/gitlab.js';
import hubspot from '../constants/trustCenterRegistry/hubspot.js';
import jonesit from '../constants/trustCenterRegistry/jones-it.js';
import kandji from '../constants/trustCenterRegistry/kandji.js';
import lovable from '../constants/trustCenterRegistry/lovable.js';
import postman from '../constants/trustCenterRegistry/postman.js';
import safebase from '../constants/trustCenterRegistry/safebase.js';
import salesforce from '../constants/trustCenterRegistry/salesforce.js';
import slack from '../constants/trustCenterRegistry/slack.js';
import stripe from '../constants/trustCenterRegistry/stripe.js';
import superhuman from '../constants/trustCenterRegistry/superhuman.js';
import vanta from '../constants/trustCenterRegistry/vanta.js';
import vercel from '../constants/trustCenterRegistry/vercel.js';
import wiz from '../constants/trustCenterRegistry/wiz.js';
import zoom from '../constants/trustCenterRegistry/zoom.js';

const trustCenterData = [
  amazon_aws,
  betterment,
  coderabbit,
  cursor,
  delve,
  drata,
  eudia,
  figma,
  github,
  gitlab,
  hubspot,
  jonesit,
  kandji,
  lovable,
  postman,
  safebase,
  salesforce,
  slack,
  stripe,
  superhuman,
  vanta,
  vercel,
  wiz,
  zoom
];

export function getAllTrustCenters() {
  // Sort by name
  return trustCenterData.sort((a, b) => a.name.localeCompare(b.name));
}

export function getTrustCenterByName(name) {
  const trustCenters = getAllTrustCenters();
  return trustCenters.find(tc => tc.name === name);
}

export function searchTrustCenters(query) {
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
    totalCompanies: trustCenters.length
  };
}
