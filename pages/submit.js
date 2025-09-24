import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { INDUSTRIES, CERTIFICATIONS, FRAMEWORKS, COMPANY_SIZES } from '../constants/industries';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    website: '',
    trustCenter: '',
    industry: '',
    description: '',
    founded: '',
    headquarters: '',
    employees: '',
    certifications: [],
    frameworks: [],
    contactSecurity: '',
    contactPrivacy: '',
    contactCompliance: ''
  });

  const [step, setStep] = useState(1);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-generate slug from name
      ...(field === 'name' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateCode = () => {
    const code = `export default ${JSON.stringify({
      name: formData.name,
      slug: formData.slug,
      website: formData.website,
      trustCenter: formData.trustCenter,
      industry: formData.industry,
      description: formData.description,
      logo: formData.slug,
      founded: parseInt(formData.founded) || undefined,
      headquarters: formData.headquarters,
      employees: formData.employees,
      certifications: formData.certifications,
      frameworks: formData.frameworks,
      documents: [],
      contact: {
        ...(formData.contactSecurity && { security: formData.contactSecurity }),
        ...(formData.contactPrivacy && { privacy: formData.contactPrivacy }),
        ...(formData.contactCompliance && { compliance: formData.contactCompliance })
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    }, null, 2)};`;

    setGeneratedCode(code);
    setStep(2);
  };

  const isFormValid = () => {
    return formData.name && 
           formData.website && 
           formData.trustCenter && 
           formData.industry && 
           formData.description;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Submit Trust Center - TrustList</title>
        <meta name="description" content="Submit your company's trust center to TrustList. Help others discover your security and compliance information." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <PlusIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit a Trust Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help the community by adding your company's trust center to our directory. 
              We review all submissions to ensure quality and accuracy.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
            </div>
          </div>

          {step === 1 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Stripe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., stripe"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for URLs and file names</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://stripe.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trust Center URL *
                    </label>
                    <input
                      type="url"
                      value={formData.trustCenter}
                      onChange={(e) => handleInputChange('trustCenter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://stripe.com/privacy-center/legal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select an industry</option>
                    {INDUSTRIES.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description of the company and its services..."
                  />
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      value={formData.founded}
                      onChange={(e) => handleInputChange('founded', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="2010"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headquarters
                    </label>
                    <input
                      type="text"
                      value={formData.headquarters}
                      onChange={(e) => handleInputChange('headquarters', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select
                      value={formData.employees}
                      onChange={(e) => handleInputChange('employees', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select size</option>
                      {COMPANY_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {CERTIFICATIONS.map(cert => (
                        <label key={cert} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certifications.includes(cert)}
                            onChange={() => handleArrayChange('certifications', cert)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{cert}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactSecurity}
                      onChange={(e) => handleInputChange('contactSecurity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="security@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactPrivacy}
                      onChange={(e) => handleInputChange('contactPrivacy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="privacy@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compliance Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactCompliance}
                      onChange={(e) => handleInputChange('contactCompliance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="compliance@company.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={generateCode}
                    disabled={!isFormValid()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Code
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Generated Code */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Generated Code</h2>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">{generatedCode}</pre>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="w-8 h-8 mr-3 text-primary-600" />
                  Submission Instructions
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">1</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Fork the Repository</h3>
                      <p className="text-gray-600">Fork the TrustList repository on GitHub to your account.</p>
                      <a 
                        href="https://github.com/FelixMichaels/trustlists/fork" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-primary-600 hover:text-primary-700"
                      >
                        Fork Repository →
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">2</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Create the File</h3>
                      <p className="text-gray-600">
                        Create a new file in the <code className="bg-gray-100 px-2 py-1 rounded">constants/trustCenterRegistry/</code> folder 
                        named <code className="bg-gray-100 px-2 py-1 rounded">{formData.slug}.js</code> and paste the generated code.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">3</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Submit Pull Request</h3>
                      <p className="text-gray-600">
                        Commit your changes and create a pull request with the title: 
                        <code className="bg-gray-100 px-2 py-1 rounded">Add {formData.name} trust center</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Submission Guidelines</h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Ensure all URLs are publicly accessible</li>
                      <li>• Only submit companies you represent or have permission to add</li>
                      <li>• Provide accurate and up-to-date information</li>
                      <li>• Follow the naming conventions for consistency</li>
                      <li>• Include relevant certifications and compliance frameworks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Form
                </button>
                
                <a
                  href="https://github.com/FelixMichaels/trustlists/compare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-trust-600 text-white rounded-lg hover:bg-trust-700 transition-colors"
                >
                  Create Pull Request
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
