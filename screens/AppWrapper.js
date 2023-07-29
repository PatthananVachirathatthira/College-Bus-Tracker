import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import LoginScreen from './LoginScreen';
import SetHomeLocation from './SetHome';
import BusList from './BusList';
import { auth } from '../firebase';

const Stack = createStackNavigator();
const LoggedStack = createStackNavigator();

function LoggedLayout() {
  return (
    <LoggedStack.Navigator>
      <Stack.Screen name="SetHome" component={SetHomeLocation} />
      <Stack.Screen name="BusList" component={BusList} />
    </LoggedStack.Navigator>
  )
}

const AppNavigator = () => {
  const [user, setUser] = useState({ loggedIn: false });
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      setUser(user);
    });
  },[]);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        {user ? (
          <Stack.Screen name="Login" component={LoggedLayout} options={{headerShown:false}}/>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppWrapper = () => {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
};

export default AppWrapper;