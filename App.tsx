import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { SpendingGoalsProvider } from './Context';
import HomeScreen from './screens/HomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import GoalsScreen from './screens/GoalsScreen';
import VisualizationScreen from './screens/VisualizationScreen';
import { initializeDatabase, databaseReady, clearDatabase } from './components/db';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const setupDatabase = async () => {
      await initializeDatabase();
      await databaseReady();
      //await clearDatabase();
    };
  
    setupDatabase();
  }, []);

  return (
    <SpendingGoalsProvider>
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            if (route.name === 'Home') {
              return <Entypo name = "home" size = {24} color = "black" />;
            }
            else if (route.name === 'Transactions') {
              return <Entypo name = "credit" size = {24} color = "black" />;
            }
            else if (route.name === 'Goals') {
              return <Entypo name = "flag" size = {24} color = "black" />;
            }
            else if (route.name === 'Visualization') {
              return <Entypo name = "bar-graph" size = {24} color = "black" />;
            }
          },
        })}>
          <Tab.Screen name = "Home" component = {HomeScreen} />
          <Tab.Screen name = "Transactions" component = {TransactionsScreen} />
          <Tab.Screen name = "Goals" component = {GoalsScreen} />
          <Tab.Screen name = "Visualization" component = {VisualizationScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SpendingGoalsProvider>
  );
}