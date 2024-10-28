import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Importer screens
import Inventory from './screens/Inventory';
import Clothes_data from './screens/Clothes_data';
import Registrer_clothes from './screens/Registrer_clothes';
import Scan from './screens/Scan';
import Wash_timer from './screens/Wash_timer';
import { TimerProvider } from './TimerContext';
import GlobalStyles from './GlobalStyles';

// Firebase configuration
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {

  //Se forsiden på rapporten eller Config.txt

};

if (getApps().length < 1) {
  initializeApp(firebaseConfig);
  console.log("Firebase On!");
}

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const StackNavigation = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2C3E50',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Inventory" component={Inventory} options={{ title: 'Inventory' }} />
        <Stack.Screen name="Clothes Data" component={Clothes_data} options={{ title: 'Clothes Data' }} />
        <Stack.Screen name="Edit Clothes" component={Registrer_clothes} options={{ title: 'Edit Clothes' }} />
      </Stack.Navigator>
    );
  };

  //ny stacknavigation der indeholder scan-skærmen og timer-skærmen
  const StackNavigation2 = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2C3E50',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="ScanScreen" component={Scan} options={{ title: 'Scan' }} />
        <Stack.Screen name="TimerScreen" component={Wash_timer} options={{ title: 'Wash Timer' }} />
      </Stack.Navigator>
    );
  };

  const BottomNavigation = () => {
    return (
      <NavigationContainer>
        <TimerProvider>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = 'home-outline';
                } else if (route.name === 'Scan') {
                  iconName = 'radio-outline';
                } else if (route.name === 'Add') {
                  iconName = 'add-circle-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007BFF',
              tabBarInactiveTintColor: '#95A5A6',
              tabBarStyle: {
                backgroundColor: '#F7F9FC',
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0',
                height: 70,
                paddingBottom: 10,
                paddingTop: 10,
              },
              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: '600',
              },
              headerShown: false,
            })}
          >
            {/* Scan er tilføjet til bundnavigationen */}
            <Tab.Screen name="Home" component={StackNavigation} options={{ title: 'Home' }} />
            <Tab.Screen name="Scan" component={StackNavigation2} options={{ title: 'Scan' }} />
            <Tab.Screen name="Add" component={Registrer_clothes} options={{ title: 'Add Clothes' }} />
          </Tab.Navigator>
        </TimerProvider>
      </NavigationContainer>
    );
  };

  return <BottomNavigation />;
}

const styles = StyleSheet.create({
  container: GlobalStyles.container,
});
