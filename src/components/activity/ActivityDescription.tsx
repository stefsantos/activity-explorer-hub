
import React from 'react';

interface ActivityDescriptionProps {
  description: string;
}

const ActivityDescription = ({ description }: ActivityDescriptionProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ActivityDescription;
