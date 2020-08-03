import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import SignUp from './signUp';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


class Opennning extends React.Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }


  render (){

    return (
      <>
        <StatusBar barStyle = "dark-content"/>
        <SafeAreaView style = {styles.container}>
          <View>
            <Image source = {require("./../images/logo.jpg")} style = {styles.logo}/>
            <Text style = {styles.header}>Udago Software</Text>
          </View>
          <View style = {styles.authButtons}>
            <TouchableOpacity style = {styles.signButton} onPress = {()=> this.props.navigation.navigate("Kayit")}>
              <Text style = {styles.signText}> Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.loginButton} onPress = {() => this.props.navigation.navigate("Giris")}>
              <Text style = {styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    height : screenHeight,
    width: screenWidth,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  logo : {
    width : 150,
    height: 150,
    top: 20*screenHeight/100,
    marginLeft: 5*screenWidth/100
  },
  header: {
    top: screenHeight*21/100,
    color : '#000',
    fontSize: 23,
    fontWeight: '600',
    textAlign: 'center'
  },
  authButtons : {
    width: '75%',
    top: screenHeight*35/100,
  
  },
  signButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 15
  },
  signText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500'
  },
  loginButton: {
    borderColor: '#000',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5
  },
  loginText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500'
  }
});

export default Opennning;
