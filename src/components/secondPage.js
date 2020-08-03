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

class SecondPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      email: "",
      passwd: "",
      name: "",
      lastName: "",
      passwdAgain: "",
      job : ""
    }
  }


  handleUnhold = (email, seatNum) => {
    let body = {
        seatNum : seatNum
    }
    axios.post("http://localhost:5000/seat/unhold", body, {
        headers: {
            token : MainStore.token
        }
    })
    .then(() =>  {
      this.getAll()
      MainStore.show1 = 1
      })
    .catch((err) => {Alert.alert(JSON.stringify(err))})
   
  }

  // handleStand = (email) => {
  //   let body = {
  //       email: email
  //   }
  //   axios.post("http://localhost:5000/user/stand", body, {
  //       headers: {
  //           token : MainStore.token
  //       }
  //   })
  //   .then(() => this.getUser())
  //   .catch(err => Alert.alert("Bir hata Meydana Geldi"))
  // }

  getUser = () => {
    axios.get("http://localhost:5000/user/me", {
        headers: {
            token : MainStore.token
        }
    })
    .then(res=> {
        MainStore.user = res.data
    })
    .catch(err => alert("Unable to Retrieve User"))
}


  render (){

    return (
      <>
        <StatusBar barStyle = "dark-content"/>
        <SafeAreaView style = {styles.container}>
          <View style = {styles.userContainer}>
              <Text style = {styles.userText}>{MainStore.user.firstname} {MainStore.user.lastname}</Text>
              <Text style = {styles.userText}>Oturma Saati : {MainStore.user.timeStarted}</Text>
              <Text style = {styles.userText}>Oturulan Masa: {MainStore.user.seatNum}</Text>
              <TouchableOpacity style=  {styles.userButton} onPress = {() => {
                  this.handleUnhold(MainStore.user.email, MainStore.user.seatNum)
                  }}>
                <Text style = {styles.userDelete}>Kalk !!</Text>
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
        position: 'absolute',
        flex:1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f6f6f8',
        bottom: 0
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
        marginTop: 65*screenHeight/100
        // bottom: 0
      },
      userButton: {
        backgroundColor: 'red',
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
        fontWeight: '600'
      },
      input : {
        textAlign: 'center',
        marginTop: 20,
        backgroundColor: '#f6f6f8',
        padding: 20,
        fontSize: 16
      }
});

export default SecondPage;
