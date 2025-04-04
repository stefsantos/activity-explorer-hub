
import React from 'react';
import { Clock, Calendar, Users, Compass, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActivityDetailType } from '@/services/types';

interface ActivityDetailsTabProps {
  activity: ActivityDetailType;
}

const ActivityDetailsTab = ({ activity }: ActivityDetailsTabProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Activity Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start">
          <Clock className="mr-3 text-kids-blue flex-shrink-0 mt-1" size={16} />
          <div>
            <h4 className="font-medium text-gray-700">Duration</h4>
            <p className="text-gray-600">{activity.duration || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Calendar className="mr-3 text-kids-green flex-shrink-0 mt-1" size={16} />
          <div>
            <h4 className="font-medium text-gray-700">Schedule</h4>
            <p className="text-gray-600">{activity.schedule || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Users className="mr-3 text-kids-purple flex-shrink-0 mt-1" size={16} />
          <div>
            <h4 className="font-medium text-gray-700">Group Size</h4>
            <p className="text-gray-600">{activity.group_size || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Compass className="mr-3 text-kids-orange flex-shrink-0 mt-1" size={16} />
          <div>
            <h4 className="font-medium text-gray-700">Age Range</h4>
            <p className="text-gray-600">
              {activity.min_age && activity.max_age 
                ? `${activity.min_age} - ${activity.max_age} years`
                : 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {activity.organizer && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Organized by</h3>
          <Link 
            to={`/organizer/${activity.organizer.id}`}
            className="block bg-gray-50 p-4 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-700">{activity.organizer.name}</h4>
                {activity.organizer.description && (
                  <p className="text-gray-600 text-sm mt-1">{activity.organizer.description}</p>
                )}
              </div>
              <ExternalLink className="text-kids-blue ml-2" size={16} />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActivityDetailsTab;
