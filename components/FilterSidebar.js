import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { INDUSTRIES, CERTIFICATIONS, FRAMEWORKS, COMPANY_SIZES } from '../constants/industries';

export default function FilterSidebar({ filters, onFilterChange, resultCount }) {
  const filterSections = [
    {
      id: 'industry',
      name: 'Industry',
      options: INDUSTRIES.map(industry => ({ value: industry, label: industry }))
    },
    {
      id: 'certification',
      name: 'Certifications',
      options: CERTIFICATIONS.map(cert => ({ value: cert, label: cert }))
    },
    {
      id: 'framework',
      name: 'Frameworks', 
      options: FRAMEWORKS.map(framework => ({ value: framework, label: framework }))
    },
    {
      id: 'companySize',
      name: 'Company Size',
      options: COMPANY_SIZES.map(size => ({ value: size, label: size }))
    }
  ];

  const handleFilterChange = (sectionId, value) => {
    const newFilters = {
      ...filters,
      [sectionId]: value === filters[sectionId] ? 'all' : value
    };
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {};
    filterSections.forEach(section => {
      clearedFilters[section.id] = 'all';
    });
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== 'all' && filter !== '');

  return (
    <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {resultCount !== undefined && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{resultCount}</span> companies found
          </p>
        </div>
      )}

      <div className="space-y-4">
        {filterSections.map((section) => (
          <Disclosure key={section.id} defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between items-center py-2 text-left text-sm font-medium text-gray-900 hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                  <span>{section.name}</span>
                  <ChevronDownIcon
                    className={`${
                      open ? 'rotate-180' : ''
                    } h-4 w-4 text-gray-500 transform transition-transform`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pb-2 text-sm text-gray-500">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={section.id}
                        value="all"
                        checked={!filters[section.id] || filters[section.id] === 'all'}
                        onChange={() => handleFilterChange(section.id, 'all')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-900">All</span>
                    </label>
                    {section.options.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name={section.id}
                          value={option.value}
                          checked={filters[section.id] === option.value}
                          onChange={() => handleFilterChange(section.id, option.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700 text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}
