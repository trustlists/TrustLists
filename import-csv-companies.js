const fs = require('fs');
const path = require('path');

// Company data with curated descriptions and logo URLs
const companies = [
  {
    name: "Google Workspace",
    website: "https://workspace.google.com/",
    trustCenter: "https://cloud.google.com/security/compliance/compliance-reports-manager",
    description: "A suite of productivity and collaboration tools including Gmail, Docs, Drive, and Meet for businesses and organizations.",
    iconUrl: "https://developers.google.com/workspace/images/workspace-icon.svg"
  },
  {
    name: "Contentsquare",
    website: "https://contentsquare.com/",
    trustCenter: "https://trust.contentsquare.com/",
    description: "Digital experience analytics platform that helps businesses understand how and why users interact with their websites and mobile apps.",
    iconUrl: "https://contentsquare.com/wp-content/uploads/2023/10/CS_Logo_Color.svg"
  },
  {
    name: "Heap",
    website: "https://www.heap.io/",
    trustCenter: "https://trust.contentsquare.com/?product=heapio",
    description: "Digital insights platform that automatically captures every user interaction to help product teams build better experiences.",
    iconUrl: "https://www.heap.io/static/logos/heap-logo-full-color.svg"
  },
  {
    name: "Hotjar",
    website: "https://www.hotjar.com/",
    trustCenter: "https://trust.contentsquare.com/?product=hotjar",
    description: "Behavior analytics and user feedback service that helps you understand how users interact with your website through heatmaps and recordings.",
    iconUrl: "https://static.hotjar.com/static/gfx/logo-hotjar.svg"
  },
  {
    name: "Mixpanel",
    website: "https://mixpanel.com/",
    trustCenter: "https://trust.mixpanel.com/",
    description: "Product analytics platform that helps companies understand user behavior and improve their product experience through data-driven insights.",
    iconUrl: "https://mixpanel.com/wp-content/uploads/2021/12/mixpanel-logo-dark.svg"
  },
  {
    name: "MongoDB",
    website: "https://mongodb.com/",
    trustCenter: "https://trust.mongodb.com/",
    description: "Document-oriented NoSQL database platform that provides high performance, high availability, and easy scalability for modern applications.",
    iconUrl: "https://www.mongodb.com/assets/images/global/favicon.ico"
  },
  {
    name: "Notion",
    website: "https://www.notion.com/",
    trustCenter: "https://public-profile.whistic.com/8e45fdd3-e2fe-4742-852b-ac509b13d0d1",
    description: "All-in-one workspace for notes, tasks, wikis, and databases that helps teams collaborate and organize their work in a connected way.",
    iconUrl: "https://www.notion.so/images/logo-ios.png"
  },
  {
    name: "Remote",
    website: "https://remote.com/",
    trustCenter: "https://trust.remote.com/",
    description: "Global HR platform that enables companies to hire, manage, and pay remote employees and contractors worldwide while ensuring compliance.",
    iconUrl: "https://remote.com/wp-content/uploads/2023/04/Remote-logomark-color.svg"
  },
  {
    name: "Segment",
    website: "https://segment.com/",
    trustCenter: "https://security.segment.com/",
    description: "Customer data platform that helps companies collect, clean, and control their customer data to create personalized experiences.",
    iconUrl: "https://segment.com/docs/images/logos/segment-icon.svg"
  },
  {
    name: "Rippling",
    website: "https://www.rippling.com/",
    trustCenter: "https://www.rippling.com/security",
    description: "Workforce management platform that combines HR, IT, and Finance functions to help companies manage their employees and systems.",
    iconUrl: "https://www.rippling.com/static/rippling-logo.svg"
  },
  {
    name: "Clockwise",
    website: "https://www.getclockwise.com/",
    trustCenter: "https://www.getclockwise.com/contact/security",
    description: "AI-powered scheduling tool that automatically finds and protects focus time in your calendar to help you get more deep work done.",
    iconUrl: "https://assets.getclockwise.com/logos/clockwise-logo-symbol-color.svg"
  },
  {
    name: "Chargeflow",
    website: "https://chargeflow.io/",
    trustCenter: "https://trust.chargeflow.io/",
    description: "Automated chargeback management platform that helps e-commerce businesses fight chargebacks and recover revenue using AI technology.",
    iconUrl: "https://chargeflow.io/wp-content/uploads/2023/10/chargeflow-logo.svg"
  },
  {
    name: "ChartMogul",
    website: "https://chartmogul.com/",
    trustCenter: "https://chartmogul.com/security/",
    description: "Subscription analytics platform that helps SaaS businesses measure, understand, and grow their recurring revenue with comprehensive metrics.",
    iconUrl: "https://chartmogul.com/assets/img/chartmogul-logo.svg"
  },
  {
    name: "Cloudflare",
    website: "https://www.cloudflare.com/",
    trustCenter: "https://dash.cloudflare.com/?to=/:account/compliance-docs",
    description: "Web infrastructure and website security company that provides content delivery network, DDoS mitigation, and internet security services.",
    iconUrl: "https://www.cloudflare.com/img/logo-cloudflare-dark.svg"
  },
  {
    name: "Carta",
    website: "https://carta.com/",
    trustCenter: "https://trust.carta.com/",
    description: "Equity management platform that helps private companies, public companies, and investors manage their cap tables, valuations, and equity plans.",
    iconUrl: "https://carta.com/wp-content/uploads/2023/11/carta-logo.svg"
  },
  {
    name: "Devin",
    website: "https://www.cognition.ai/",
    trustCenter: "https://trust.cognition.ai/",
    description: "AI-powered software engineering assistant that can write, debug, and deploy code autonomously to help accelerate software development.",
    iconUrl: "https://www.cognition.ai/favicon.ico"
  },
  {
    name: "Ghost",
    website: "https://ghost.org/",
    trustCenter: "https://ghost.org/docs/security/",
    description: "Modern publishing platform designed for creators and publishers to build and grow their audience with newsletters, memberships, and subscriptions.",
    iconUrl: "https://ghost.org/images/logos/ghost-logo-dark.png"
  },
  {
    name: "Grain",
    website: "https://grain.com/",
    trustCenter: "https://trust.grain.com/",
    description: "AI-powered meeting recorder and note-taker that automatically captures, transcribes, and summarizes your video calls for better collaboration.",
    iconUrl: "https://grain.com/_next/static/images/grain-logo-full-color-0123456789abcdef.svg"
  },
  {
    name: "Hugging Face",
    website: "https://huggingface.co/",
    trustCenter: "https://huggingface.co/docs/hub/security",
    description: "Open-source platform for machine learning that provides tools, models, and datasets for natural language processing and AI development.",
    iconUrl: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
  },
  {
    name: "Lattice",
    website: "https://lattice.com/",
    trustCenter: "https://trustcenter.lattice.com/",
    description: "People management platform that helps companies build high-performing teams through performance reviews, goal setting, and employee engagement.",
    iconUrl: "https://lattice.com/wp-content/themes/lattice/assets/img/lattice-logo.svg"
  },
  {
    name: "Loom",
    website: "https://www.loom.com/",
    trustCenter: "https://www.atlassian.com/trust/compliance/resources/soc2",
    description: "Video messaging tool that allows you to quickly record and share videos of your screen, camera, or both for async communication.",
    iconUrl: "https://cdn.loom.com/assets/logos/loom-logo-purple.svg"
  },
  {
    name: "Metabase",
    website: "https://www.metabase.com/",
    trustCenter: "https://trust.metabase.com/",
    description: "Open-source business intelligence tool that makes it easy for anyone in your company to ask questions and learn from data.",
    iconUrl: "https://www.metabase.com/images/logo.svg"
  },
  {
    name: "Microsoft",
    website: "https://www.microsoft.com/",
    trustCenter: "https://servicetrust.microsoft.com/",
    description: "Technology company that develops computer software, consumer electronics, personal computers, and related services including Azure, Office, and Windows.",
    iconUrl: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b"
  },
  {
    name: "Wispr Flow",
    website: "https://wisprflow.ai/",
    trustCenter: "https://app.delve.co/wispr-flow",
    description: "AI-powered voice-to-text technology that enables hands-free writing and dictation with superior accuracy and natural language processing.",
    iconUrl: "https://wisprflow.ai/favicon.ico"
  },
  {
    name: "Linear",
    website: "https://linear.app/",
    trustCenter: "https://trustcenter.linear.app/",
    description: "Issue tracking and project management tool designed for modern software development teams with a focus on speed and user experience.",
    iconUrl: "https://linear.app/static/favicons/favicon-96x96.png"
  },
  {
    name: "Modal",
    website: "https://modal.com/",
    trustCenter: "https://modal.com/docs/guide/security",
    description: "Cloud platform for running generative AI models, batch jobs, and distributed computing workloads with simple Python-based deployment.",
    iconUrl: "https://modal.com/favicon.ico"
  },
  {
    name: "MotherDuck",
    website: "https://motherduck.com/",
    trustCenter: "https://motherduck.com/trust-and-security/#Compliance",
    description: "Serverless DuckDB-in-the-cloud platform that combines the simplicity of DuckDB with the scalability and collaboration features of the cloud.",
    iconUrl: "https://motherduck.com/favicon.ico"
  },
  {
    name: "Parasail",
    website: "https://parasail.io/",
    trustCenter: "https://trust.parasail.io/",
    description: "Customer success platform that helps B2B companies reduce churn and grow revenue by providing insights into customer health and behavior.",
    iconUrl: "https://parasail.io/favicon.ico"
  },
  {
    name: "Ramp",
    website: "https://ramp.com/",
    trustCenter: "https://trust.ramp.com/",
    description: "Corporate card and spend management platform that helps businesses control expenses, automate accounting, and earn rewards on purchases.",
    iconUrl: "https://ramp.com/favicon.ico"
  },
  {
    name: "Rewardful",
    website: "https://www.rewardful.com/",
    trustCenter: "https://trust.rewardful.com/",
    description: "Affiliate and referral marketing platform that helps SaaS companies create and manage affiliate programs to drive customer acquisition.",
    iconUrl: "https://www.rewardful.com/favicon.ico"
  },
  {
    name: "Typeform",
    website: "https://www.typeform.com/",
    trustCenter: "https://trust.typeform.com/",
    description: "Online form builder that creates engaging, conversational forms and surveys to collect data and insights from your audience.",
    iconUrl: "https://images.typeform.com/images/logo-typeform-pink.svg"
  },
  {
    name: "Vespa",
    website: "https://vespa.ai/",
    trustCenter: "https://trust.vespa.ai/",
    description: "Open-source big data serving engine that enables real-time computation over large datasets for search, recommendation, and AI applications.",
    iconUrl: "https://vespa.ai/assets/vespa-logo-color.svg"
  },
  {
    name: "Webflow",
    website: "https://webflow.com/",
    trustCenter: "https://trust.webflow.com/",
    description: "Visual web development platform that enables designers to build responsive websites without coding while generating clean, semantic code.",
    iconUrl: "https://webflow.com/favicon.ico"
  },
  {
    name: "Weights & Biases",
    website: "https://wandb.ai/",
    trustCenter: "https://wandb.ai/site/security/",
    description: "Machine learning platform for experiment tracking, model versioning, and collaboration to help ML teams build better models faster.",
    iconUrl: "https://wandb.ai/favicon.ico"
  },
  {
    name: "Zapier",
    website: "https://zapier.com/",
    trustCenter: "https://trust.zapier.com/",
    description: "Automation platform that connects different apps and services to automate workflows and eliminate repetitive tasks without coding.",
    iconUrl: "https://cdn.zapier.com/storage/photos/9dd0f13b3b9d30d9de9ad7c5b1d8009d.png"
  },
  {
    name: "Pave",
    website: "https://www.pave.com/",
    trustCenter: "https://www.pave.com/security-and-privacy",
    description: "Compensation management platform that helps companies design, communicate, and manage fair and competitive compensation programs.",
    iconUrl: "https://www.pave.com/favicon.ico"
  },
  {
    name: "Okta",
    website: "https://www.okta.com/",
    trustCenter: "https://trust.okta.com/",
    description: "Identity and access management platform that provides secure identity solutions for enterprises including single sign-on and multi-factor authentication.",
    iconUrl: "https://www.okta.com/sites/default/files/Okta_Logo_BrightBlue_Medium-thumbnail.png"
  },
  {
    name: "Hex",
    website: "https://hex.tech/",
    trustCenter: "https://trust.hex.tech/",
    description: "Collaborative data platform that combines SQL, Python, and no-code tools to help teams explore, analyze, and share data insights.",
    iconUrl: "https://hex.tech/favicon.ico"
  },
  {
    name: "Atlassian",
    website: "https://www.atlassian.com/",
    trustCenter: "https://www.atlassian.com/trust/compliance/resources/soc2",
    description: "Software company that develops products for software development, project management, and content management including Jira, Confluence, and Trello.",
    iconUrl: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon-32x32.png"
  },
  {
    name: "PagerDuty",
    website: "https://www.pagerduty.com/",
    trustCenter: "https://www.pagerduty.com/security/",
    description: "Digital operations management platform that helps teams prevent and resolve business-impacting incidents through intelligent incident response.",
    iconUrl: "https://www.pagerduty.com/wp-content/uploads/2023/01/PagerDuty-icon-green.svg"
  }
];

// Function to generate filename from company name
function generateFilename(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Create all company files
function createCompanyFiles() {
  const registryDir = path.join(__dirname, 'constants/trustCenterRegistry');
  
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  companies.forEach(company => {
    const filename = generateFilename(company.name) + '.js';
    const filepath = path.join(registryDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⚠️  Skipped ${filename} (already exists)`);
      skipped++;
      return;
    }

    const fileContent = `export default ${JSON.stringify(company, null, 2)};`;
    
    fs.writeFileSync(filepath, fileContent);
    console.log(`✅ Created ${filename}`);
    created++;
  });

  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped, ${companies.length} total`);
  
  return { created, skipped, total: companies.length };
}

// Run the script
if (require.main === module) {
  console.log('🚀 Creating company files from CSV data...\n');
  const result = createCompanyFiles();
  
  if (result.created > 0) {
    console.log('\n🔄 Regenerating utils and JSON files...');
    const generateUtils = require('./generate-utils.js');
    const generateJson = require('./generate-json.js');
    
    generateUtils();
    // Note: generate-json.js needs to be run separately as it's not a module
  }
}

module.exports = { companies, createCompanyFiles };
