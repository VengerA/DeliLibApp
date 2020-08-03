import React from 'react';
import {

} from 'react-native';

import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Openning from './src/components/openning';
import Login from './src/components/login';
import SignUp from './src/components/signUp';
import Profile from './src/components/profile';
import MainPage from './src/components/mainPage';
import Library from './src/components/library';
import MainStore from './src/components/store';

console.disableYellowBox = true; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName = "Libraries">
      <Stack.Screen name = "Libraries" component = {Library} options = {{headerShown: false}} />
      <Stack.Screen  name = "Seats" component = {MainPage} options = {{headerStyle: {backgroundColor: '#000', color: '#fff'}, headerTitleStyle: {color: "white", fontSize: 24}, headerBackTitleVisible: false, headerTintColor: 'white', title : MainStore.title}} />
    </Stack.Navigator>
  )
}



function TabBar() {
  return (
    <Tab.Navigator
          screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Libraries') {
              iconName = 'book'
            } else if (route.name === 'Profile') {
              iconName = 'user';
            }else if(route.name === 'Seats'){
              iconName = 'chair'
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={"#000"} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#000',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Libraries" component={HomeStack}/>
        <Tab.Screen name="Profile" component={Profile}/>
      </Tab.Navigator>
  )
}




export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>    
        
          <Stack.Screen name="Openning" component={Openning} options = {{headerShown: false}} />
          <Stack.Screen name="Giris" component={Login} options = {{ headerTitle: "", headerBackTitle: " "}} />
          <Stack.Screen name="Kayit" component={SignUp} options = {{ headerTitle: "", headerBackTitle: " "}} />
          <Stack.Screen name="App" component= {TabBar} options = {{headerShown : false }} />
          
        </Stack.Navigator>
    </NavigationContainer>
  );
}


