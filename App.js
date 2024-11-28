import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import SeatSelectionScreen from './screens/SeatSelectionScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Películas',
            headerLeft: null
          }}
        />
        <Stack.Screen 
          name="MovieDetail" 
          component={MovieDetailScreen}
          options={{
            title: '',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerBackTitle: ' ',
          }}
        />
        <Stack.Screen 
          name="SeatSelection" 
          component={SeatSelectionScreen}
          options={{
            title: 'Selección de Asientos',
          }}
        />
        <Stack.Screen 
          name="OrderSummary" 
          component={OrderSummaryScreen}
          options={{
            title: 'Resumen de la orden',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;