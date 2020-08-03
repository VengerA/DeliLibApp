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
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

import MainStore from './store';
import axios from 'axios';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


class Login extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      email : "", 
      passwd : ""
    }
  }

  handleLogin = () => {
    let newUser = {
      email : this.state.email,
      password : this.state.passwd
    }
    // Alert.alert(JSON.stringify(newUser))
    axios.post("http://localhost:5000/user/login", newUser)
    .then(res=> {
      MainStore.token = res.data.token
      MainStore.online = true
      MainStore.email = this.state.email
      this.props.navigation.navigate("App")
      // Alert.alert("basarili")
    })
    .catch(err => {
      // if(err.res.status === 404){
      //   Alert.alert(err.response.data.message)
      // }
      // else {
      //   Alert.alert(JSON.stringify(err.response))
      // }
      Alert.alert(JSON.stringify(err.response.data))
    
    })
   
  }

  componentDidMount(){
    if(MainStore.online){
      this.props.navigation.navigate("App")
    }
  }
  

  render (){

    return (
      <>
        <StatusBar barStyle = "dark-content"/>
        <SafeAreaView style = {styles.container}>
          <View>
            <Image source = {require("./../images/logo.jpg")} style = {styles.logo}/>
          </View>
          <View style = {styles.authButtons}>
            <TextInput autoCapitalize = 'none'  placeholder = 'Email' style = {styles.loginInputs} onChangeText = {text => this.setState({email: text})}/>
            <TextInput  placeholder = 'Password' secureTextEntry = {true} style = {styles.loginInputs} onChangeText = {text => this.setState({passwd: text})}/>     
            <TouchableOpacity style = {styles.signButton} onPress = {() => {this.handleLogin()}}>
              <Text style = {styles.signText}>LogIn</Text>
            </TouchableOpacity>
            <View style = {{flexDirection: 'row', marginTop: 60, left: '20%'}}>
              <Text style = {styles.footerText}>Don`t Have an Account ? </Text>
              <TouchableOpacity onPress = {() => {this.props.navigation.navigate("Kayit")}}>
                <Text style = {styles.footerTextLast}> Sign Up</Text>
              </TouchableOpacity>
            </View>
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
    width : 120,
    height: 120,
    top: 2*screenHeight/100,
    
  },
  authButtons : {
    width: '75%',
    top: screenHeight*10/100,
  
  },
  signButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 15,
    marginTop: 20
  },
  signText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400'
  },
  loginInputs :{ 
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    height: 40
  },
  unuttum : {
    fontSize: 10,
    color: '#000',
    textDecorationLine: "underline",
    textAlign: "right"
  },
  footerText: {
    color: '#000',
    textAlign: 'center'
  },
  footerTextLast:{
    color: '#000',
    
  }
});

export default Login;
