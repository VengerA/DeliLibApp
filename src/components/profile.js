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

import axios from 'axios';
import MainStore from './store'
import {observer} from 'mobx-react'


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const Profile = observer(
  class Profile extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        password: "",
        passwordOld: "",
        passwordAgain: "",
        hour : 0,
        minute : 0
      }
    }

    static navigationOptions = {
      headerMode: 'none'
    }

      getUser = () => {
        axios.get("http://localhost:5000/user/me", {
            headers: {
                token : MainStore.token
            }
        })
        .then(res=> {
            MainStore.user = res.data
        })
        .catch(err => err.response.data.errors.map(item => Alert.alert(item.msg)))
    }


    handlePassword = () => {
      if(this.state.password !== this.state.passwordAgain){
        Alert.alert("Passwords Must Match !!")
      }
      else {
        let body = {
          email : MainStore.user.email,
          password: this.state.password,
          oldPassword: this.state.passwordOld
        }
        // Alert.alert(JSON.stringify(body))
        axios.post("http://localhost:5000/user/changePasswd", body,{
            headers: {
                token : MainStore.token
            }
        })
        .then(res=> {
            Alert.alert("Your Password Changed Successfully !!")
        })
        .catch(err => JSON.stringify(err.response))

      }
    }

    handleLogout = () => {
      MainStore.token = ""
      MainStore.user = {}
      MainStore.online = false
      this.props.navigation.navigate("Openning")
    }


    componentDidMount(){
      this.getUser()
      this.setState({
        day: Math.floor((MainStore.user.totalTimeStudied /(3600*24)) % 365),
        minute: Math.floor((MainStore.user.totalTimeStudied / 60) % 60),
        hour: Math.floor((MainStore.user.totalTimeStudied / 3600) % 24),
      })

    }

    render (){


      return (
        <>
          <StatusBar barStyle = "dark-content"/>
          <SafeAreaView style = {styles.container}>
            <View style = {styles.userContainer}>
              <Text style = {styles.userText}>{MainStore.user.firstname} {MainStore.user.lastname}</Text>
              <Text style = {styles.userText}>Firat Ilhan Okullari Kutuphanesi</Text>
  
              <View style = {{flexDirection: 'row', width: '100%'}}>
                <Text style = {styles.userText2} >Toplam Calisma Suresi : </Text>
                <Text style = {styles.userText2}>{this.state.day} gun {this.state.hour} saat  {this.state.minute} dakika</Text>
              </View>
              
              <TextInput secureTextEntry = {true} style = {styles.input} placeholder= "Your Old Password" value = {this.state.passwordOld} onChangeText = {(text)=> this.setState({passwordOld: text})}/>
              <TextInput secureTextEntry = {true} style = {styles.input} placeholder= "Enter New Password" value = {this.state.password} onChangeText = {(text)=> this.setState({password: text})}/>
              <TextInput secureTextEntry = {true} style = {styles.input} placeholder= "Enter New Again Password" value = {this.state.passwordAgain} onChangeText = {(text)=> this.setState({passwordAgain: text})}/>
              <TouchableOpacity style=  {styles.userButton} onPress = {() => this.handlePassword(MainStore.user.email)}>
                <Text style = {styles.userDelete}>Save Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style=  {styles.userButton2} onPress = {() => this.handleLogout()}>
                <Text style = {styles.userDelete}>Log Out</Text>
              </TouchableOpacity>
            </View>

            
          </SafeAreaView>
        </>
      )
    }
  }
)

const styles = StyleSheet.create({
  container : {
    height : screenHeight,
    width: screenWidth,
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f6f6f8'
  },
  header: {
    color: "#5572b5",
    fontSize: 24, 
    top: 6*screenHeight/100,
    textAlign: 'center'
  },  
  userContainer: {
    // borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    width: 80*screenWidth/100,
    marginLeft: '10%',
    // marginTop: 50,
    justifyContent: 'center',
    marginTop: 15*screenHeight/100
  },
  userButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 20
  },
  userButton2: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 20
  },
  userDelete: {
    color: '#fff',
    textAlign: 'center'
  },
  userText: {
    width: '100%',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  userText2: {
    // width: '50%',
    marginTop: 20,
    textTransform: 'capitalize',
    fontSize: 12,
    fontWeight: '600',
  },
  input : {
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: '#f6f6f8',
    padding: 20,
    fontSize: 16
  }
  
});

export default Profile;
