// Auto-generated imports - DO NOT EDIT MANUALLY
// This file is automatically updated by generate-utils.js
import _1password from '../constants/trustCenterRegistry/1password.js';
import amazon_aws from '../constants/trustCenterRegistry/amazon_aws.js';
import betterment from '../constants/trustCenterRegistry/betterment.js';
import carta from '../constants/trustCenterRegistry/carta.js';
import chargeflow from '../constants/trustCenterRegistry/chargeflow.js';
import checkr from '../constants/trustCenterRegistry/checkr.js';
import cluely from '../constants/trustCenterRegistry/cluely.js';
import coderabbit from '../constants/trustCenterRegistry/coderabbit.js';
import contentsquare from '../constants/trustCenterRegistry/contentsquare.js';
import cursor from '../constants/trustCenterRegistry/cursor.js';
import delve from '../constants/trustCenterRegistry/delve.js';
import devin from '../constants/trustCenterRegistry/devin.js';
import drata from '../constants/trustCenterRegistry/drata.js';
import eudia from '../constants/trustCenterRegistry/eudia.js';
import figma from '../constants/trustCenterRegistry/figma.js';
import github from '../constants/trustCenterRegistry/github.js';
import gitlab from '../constants/trustCenterRegistry/gitlab.js';
import googleworkspace from '../constants/trustCenterRegistry/google-workspace.js';
import grain from '../constants/trustCenterRegistry/grain.js';
import heap from '../constants/trustCenterRegistry/heap.js';
import hex from '../constants/trustCenterRegistry/hex.js';
import hotjar from '../constants/trustCenterRegistry/hotjar.js';
import hubspot from '../constants/trustCenterRegistry/hubspot.js';
import jonesit from '../constants/trustCenterRegistry/jones-it.js';
import kandji from '../constants/trustCenterRegistry/kandji.js';
import lattice from '../constants/trustCenterRegistry/lattice.js';
import linear from '../constants/trustCenterRegistry/linear.js';
import lovable from '../constants/trustCenterRegistry/lovable.js';
import metabase from '../constants/trustCenterRegistry/metabase.js';
import microsoft from '../constants/trustCenterRegistry/microsoft.js';
import mixpanel from '../constants/trustCenterRegistry/mixpanel.js';
import mongodb from '../constants/trustCenterRegistry/mongodb.js';
import notion from '../constants/trustCenterRegistry/notion.js';
import okta from '../constants/trustCenterRegistry/okta.js';
import parasail from '../constants/trustCenterRegistry/parasail.js';
import postman from '../constants/trustCenterRegistry/postman.js';
import ramp from '../constants/trustCenterRegistry/ramp.js';
import remote from '../constants/trustCenterRegistry/remote.js';
import rewardful from '../constants/trustCenterRegistry/rewardful.js';
import safebase from '../constants/trustCenterRegistry/safebase.js';
import salesforce from '../constants/trustCenterRegistry/salesforce.js';
import segment from '../constants/trustCenterRegistry/segment.js';
import slack from '../constants/trustCenterRegistry/slack.js';
import stripe from '../constants/trustCenterRegistry/stripe.js';
import superhuman from '../constants/trustCenterRegistry/superhuman.js';
import typeform from '../constants/trustCenterRegistry/typeform.js';
import vanta from '../constants/trustCenterRegistry/vanta.js';
import vercel from '../constants/trustCenterRegistry/vercel.js';
import vespa from '../constants/trustCenterRegistry/vespa.js';
import webflow from '../constants/trustCenterRegistry/webflow.js';
import wisprflow from '../constants/trustCenterRegistry/wispr-flow.js';
import wiz from '../constants/trustCenterRegistry/wiz.js';
import zapier from '../constants/trustCenterRegistry/zapier.js';
import zoom from '../constants/trustCenterRegistry/zoom.js';

const trustCenterData = [
  _1password,
  amazon_aws,
  betterment,
  carta,
  chargeflow,
  checkr,
  cluely,
  coderabbit,
  contentsquare,
  cursor,
  delve,
  devin,
  drata,
  eudia,
  figma,
  github,
  gitlab,
  googleworkspace,
  grain,
  heap,
  hex,
  hotjar,
  hubspot,
  jonesit,
  kandji,
  lattice,
  linear,
  lovable,
  metabase,
  microsoft,
  mixpanel,
  mongodb,
  notion,
  okta,
  parasail,
  postman,
  ramp,
  remote,
  rewardful,
  safebase,
  salesforce,
  segment,
  slack,
  stripe,
  superhuman,
  typeform,
  vanta,
  vercel,
  vespa,
  webflow,
  wisprflow,
  wiz,
  zapier,
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
