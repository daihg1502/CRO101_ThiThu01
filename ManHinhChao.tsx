import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ManHinhChao = ({ navigation }) => {
  setTimeout(() => {
    navigation.replace('ManHinhHT')
  }, 3000);
  return (
    <View style={styles.container}>
      <Image source={require('./logo_fpoly.png')} style={styles.logo} />
      <Text style={styles.text}>Hoàng Gia Đại</Text>
      <Text style={[styles.text, styles.msv]}>MSV:PH36944</Text>
    </View>
  )
}

export default ManHinhChao

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 250,
    height: 80,
    resizeMode: 'center',
    marginBottom: 50
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  msv: {
    fontSize: 30,
    color: 'red'
  }
})