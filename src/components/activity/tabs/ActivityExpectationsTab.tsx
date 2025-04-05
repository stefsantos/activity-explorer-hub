
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ActivityDetailType } from '@/services/types';

interface ActivityExpectationsTabProps {
  expectations: ActivityDetailType['expectations'];
}

type ExpectationType = {
  id: string;
  description: string;
};

const ActivityExpectationsTab = ({ expectations }: ActivityExpectationsTabProps) => {
  // Ensure expectations is treated as an array of objects with id and description
  const formattedExpectations: ExpectationType[] = Array.isArray(expectations) 
    ? expectations.map(exp => {
        if (typeof exp === 'string') {
          return { id: crypto.randomUUID(), description: exp };
        }
        return exp as ExpectationType;
      })
    : [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">What to Expect</h3>
      <ul className="space-y-3">
        {formattedExpectations.length === 0 ? (
          <p className="text-gray-500">No expectations specified</p>
        ) : (
          formattedExpectations.map(expectation => (
            <li key={expectation.id} className="flex items-start">
              <CheckCircle className="text-kids-green mr-2 flex-shrink-0 mt-1" size={16} />
              <span className="text-gray-600">{expectation.description}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityExpectationsTab;
