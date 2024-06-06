import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import GoalsScreen from './screens/GoalsScreen';
import VisualizationScreen from './screens/VisualizationScreen';
import { initializeDatabase } from './components/db';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const setupDatabase = async () => {
      await initializeDatabase();
    };
  
    setupDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen name = "Home" component = {HomeScreen} />
        <Tab.Screen name = "Transactions" component = {TransactionsScreen} />
        <Tab.Screen name = "Goals" component = {GoalsScreen} />
        <Tab.Screen name = "Visualization" component = {VisualizationScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}