import Link from 'next/link';
import { 
  BuildingOfficeIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function TrustCenterCard({ trustCenter }) {
  const {
    name,
    slug,
    industry,
    description,
    certifications,
    employees,
    trustCenter: trustCenterUrl,
    website,
    lastUpdated
  } = trustCenter;

  return (
    <div className="trust-card bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-trust-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <BuildingOfficeIcon className="w-4 h-4 mr-1" />
              {industry}
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <UserGroupIcon className="w-4 h-4 mr-1" />
          {employees}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4" style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {description}
      </p>

      {/* Certifications */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {certifications.slice(0, 3).map((cert, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-trust-100 text-trust-800"
            >
              <ShieldCheckIcon className="w-3 h-3 mr-1" />
              {cert}
            </span>
          ))}
          {certifications.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{certifications.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <a
            href={trustCenterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <ShieldCheckIcon className="w-4 h-4 mr-1" />
            Trust Center
          </a>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <GlobeAltIcon className="w-4 h-4 mr-1" />
            Website
          </a>
        </div>
        
        {lastUpdated && (
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="w-3 h-3 mr-1" />
            {new Date(lastUpdated).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
