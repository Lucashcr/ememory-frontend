import React from 'react';
import { Tabs } from 'expo-router';
import { Calendar, CheckSquare, BookOpen } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Revisões para hoje',
          tabBarIcon: ({ color, size }) => (
            <CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Disciplinas',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendário',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}