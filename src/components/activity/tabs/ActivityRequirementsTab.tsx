
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ActivityDetailType } from '@/services/types';

interface ActivityRequirementsTabProps {
  requirements: ActivityDetailType['requirements'];
}

const ActivityRequirementsTab = ({ requirements }: ActivityRequirementsTabProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">What to Bring</h3>
      <ul className="space-y-3">
        {requirements.length === 0 ? (
          <p className="text-gray-500">No specific requirements</p>
        ) : (
          requirements.map(requirement => (
            <li key={requirement.id} className="flex items-start">
              <CheckCircle className="text-kids-blue mr-2 flex-shrink-0 mt-1" size={16} />
              <span className="text-gray-600">{requirement.description}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityRequirementsTab;
