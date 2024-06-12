import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ManHinhChao from './ManHinhChao';
import ManHinhHT from './ManHinhHT';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ManHinhChao'>
        <Stack.Screen name='ManHinhChao' component={ManHinhChao} options={{ headerShown: false }} />
        <Stack.Screen name='ManHinhHT' component={ManHinhHT} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})