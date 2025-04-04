
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ActivityDetailsTab from './tabs/ActivityDetailsTab';
import ActivityReviewsTab from './tabs/ActivityReviewsTab';
import ActivityExpectationsTab from './tabs/ActivityExpectationsTab';
import ActivityRequirementsTab from './tabs/ActivityRequirementsTab';
import { ActivityDetailType } from '@/services/types';

interface ActivityTabsProps {
  activity: ActivityDetailType;
  onReviewSuccess: () => void;
}

const ActivityTabs = ({ activity, onReviewSuccess }: ActivityTabsProps) => {
  return (
    <Tabs defaultValue="details" className="mb-6">
      <TabsList className="mb-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({activity.reviews.length})</TabsTrigger>
        <TabsTrigger value="expectations">What to Expect</TabsTrigger>
        <TabsTrigger value="requirements">Requirements</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <ActivityDetailsTab activity={activity} />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ActivityReviewsTab 
          activity={activity} 
          onReviewSuccess={onReviewSuccess} 
        />
      </TabsContent>
      
      <TabsContent value="expectations">
        <ActivityExpectationsTab expectations={activity.expectations} />
      </TabsContent>
      
      <TabsContent value="requirements">
        <ActivityRequirementsTab requirements={activity.requirements} />
      </TabsContent>
    </Tabs>
  );
};

export default ActivityTabs;
