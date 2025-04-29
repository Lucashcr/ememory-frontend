import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { useSubjects } from '@/contexts/SubjectsContext';
import React, { useState } from 'react';
import { RefreshControl } from 'react-native';

export default function CustomRefreshControl() {
  const [refreshing, setRefreshing] = useState(false);

  const { fetchReviews } = useReviews();
  const { fetchSubjects } = useSubjects();
  const { fetchUserData } = useAuth();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchReviews(), fetchSubjects(), fetchUserData()]);
    setRefreshing(false);
  };

  return (
    <RefreshControl
      colors={['#6366f1']}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
