import React, { useState } from 'react';
import { RefreshControl } from 'react-native';

interface CustomRefreshControlProps {
  fetchReviews?: () => Promise<void>;
  fetchSubjects?: () => Promise<void>;
  fetchUserData?: () => Promise<void>;
}

export default function CustomRefreshControl({
  fetchReviews,
  fetchSubjects,
  fetchUserData,
}: CustomRefreshControlProps) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    const promises = [];
    if (fetchReviews) {
      promises.push(fetchReviews());
    }
    if (fetchSubjects) {
      promises.push(fetchSubjects());
    }
    if (fetchUserData) {
      promises.push(fetchUserData());
    }
    await Promise.all(promises);
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
