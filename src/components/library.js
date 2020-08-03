import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
  Image
} from 'react-native';

import axios from 'axios';
import MainStore from './store'
import {observer} from 'mobx-react'
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';


// import MainStore from './store';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const Library = observer(
  class Library extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        chosen: {},
        show : 0,
        group: 1,
        date: null
      }
    }

    static navigationOptions = {
      headerMode: 'none'
    }

    getUser = () => {
      // alert(MainStore.token)
      body = {
        email: MainStore.email
      }
      axios.post("http://localhost:5000/user/me", body, {
          headers: {
              token : MainStore.token
          }
      })
      .then(res=> {
          // alert(JSON.stringify(res.data))
          MainStore.user = res.data
      })
      .catch(err => {
        alert(JSON.stringify(err.response.data))
      })
    }


    getLibraries = () => {
      // alert(MainStore.token)
      axios.get("http://localhost:5000/library/all", {
        headers :{
          token : MainStore.token
        }
      })
      .then( res => {
        // alert(JSON.stringify(res.data))
        MainStore.libraries = res.data
      })
      .catch(err => {
        alert(JSON.stringify(err))
      })
    }

    getLibrary = (lib) => {
      let body = {
        seatCollectionName: lib.seatCollectionName,
        group: lib.groupNames[0]
      }
      // alert(JSON.stringify(body))
      axios.post("http://localhost:5000/seat/all", body, {
        headers: {
          token : MainStore.token
        }
      })
      .then(res => {
        // alert(JSON.stringify(res.data))

        MainStore.chairs = res.data
        MainStore.title = lib.libName
        // alert(MainStore.title)
        this.props.navigation.navigate("Seats")
      })
      .catch(err => {
        alert(JSON.stringify(err.response.data))
      })
    }

    componentDidMount(){
      this.getUser()
      this.getLibraries()
    }


    

    render (){
      // this.getLibraries()
      const showLibraries = MainStore.libraries.map(item => {
        // alert(JSON.stringify(item.groupNames))
        if(item.libName === MainStore.user.library){
          return ((
            <TouchableOpacity style = {styles.container2} onPress = {() => {
              MainStore.library = item
              this.getLibrary(item)
              } }>
              <LinearGradient colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.45)']} style={{position: 'absolute', height: 150, width: screenWidth *80 / 100, zIndex: 32, borderRadius: 30}}></LinearGradient>
              <Image style = {{position: 'absolute', width: screenWidth *80 / 100, height: 150, borderRadius: 30,resizeMode: 'stretch',}} source = {require('./../images/baki2.jpeg')}/>
              <View style = {{ zIndex: 33, color: 'white', width: '100%', top: 10}}>
                <View style ={{flexDirection: 'row', width: '100%'}}>
                  <Text style = {{fontSize: 32, fontWeight: '300', color: 'white', textAlign: 'center',width: '100%' }}>{item.libName}</Text>
                  <Icon name = "user" size = {32}  style = {{color : 'white', marginLeft: '-15%' }}/>
                  
                </View>
                
                <View style = {{flexDirection: 'row', marginTop: 70, width: '100%'}}>
                  <Text style = {{color: 'white', width: '40%', marginLeft: '5%'}}>Seat Number: {item.seatCount}</Text>
                  <Text style = {{color: 'white', textAlign: 'right', alignSelf: 'flex-end', width: '45%'}}>Groups: {item.groupCount}</Text>
                </View>
              
              </View>
              
              
            </TouchableOpacity>
          ))
        }
        
        return ((
          <TouchableOpacity style = {styles.container2} onPress = {() => {
            MainStore.library = item
            this.getLibrary(item)
            } }>
            <LinearGradient colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.45)']} style={{position: 'absolute', height: 150, width: screenWidth *80 / 100, zIndex: 32, borderRadius: 30}}></LinearGradient>
            <Image style = {{position: 'absolute', width: screenWidth *80 / 100, height: 150, borderRadius: 30,resizeMode: 'stretch',}} source = {require('./../images/baki2.jpeg')}/>
            <View style = {{ zIndex: 33, color: 'white', width: '100%', top: 10}}>
              <Text style = {{fontSize: 32, fontWeight: '300', color: 'white', textAlign: 'center'}}>{item.libName}</Text>
              <View style = {{flexDirection: 'row', marginTop: 70, width: '100%'}}>
                <Text style = {{color: 'white', width: '40%', marginLeft: '5%'}}>Seat Number: {item.seatCount}</Text>
                <Text style = {{color: 'white', textAlign: 'right', alignSelf: 'flex-end', width: '45%'}}>Groups: {item.groupCount}</Text>
              </View>
            
            </View>
            
            
          </TouchableOpacity>
        ))
      })
      const showChosen = () => {
        if(MainStore.user.isSeated){
          let internalNow = new Date(Date.parse(MainStore.user.timeStarted))
          let hour = internalNow.getHours()
          let minute = internalNow.getMinutes()
          if(hour < 10){
            hour = "0" + hour
          }
          if(minute < 10){
            minute = "0" + minute
          }
          return ((
            <>
              <View style = {styles.userContainer4}>
                <Text style = {styles.userText2}>Kutuphane: {MainStore.user.library}</Text>
                <Text style = {styles.userText2}>Oturulan Masa: {MainStore.user.seatNum}</Text>
              </View>
            </>
          ))
        }
      }
      return (
        <>
          <StatusBar barStyle = "dark-content"/>
          <SafeAreaView style = {styles.container}>
            <ScrollView>
              
              {showLibraries}
              
            </ScrollView>
            {showChosen()}
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
    backgroundColor: '#fff'
  },
  container2: {
    marginTop: 20,
    height : 150,
    width: screenWidth *80 / 100,
    marginLeft: '10%',
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    flexDirection: 'row',
    // flexWrap: 'wrap',
    
    borderRadius: 30
  },
  header: {
    // color: "#5572b5",
    fontSize: 24, 
    top: 6*screenHeight/100,
    textAlign: 'center'
  },  
  userContainer: {
    // borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    // width: 20,
    marginLeft: '1%',
    // justifyContent: 'center',
  },
  userContainer2: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    width: 80*screenWidth/100,
    height: 18*screenHeight/100,
    marginLeft: '10%',
    bottom: 100,
    // position: 'absolute'
    
    // marginTop: 50,
    // justifyContent: 'center',
  },
  userContainer3: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    width: 80*screenWidth/100,
    // height: 300,
    marginLeft: '10%',
    // marginTop: 50,
    justifyContent: 'center',
    position: 'absolute',
    marginTop: 59*screenHeight/100
  },
  userContainer4: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: 80*screenWidth/100,
    marginLeft: '10%',
    // marginTop: 50,
    justifyContent: 'center',
    position: 'absolute',
    marginTop: 80*screenHeight/100
    // bottom: 0
  },
  wrapper: {
    marginVertical: 10, alignItems: 'center'
  },
  userButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10
  },
  userDelete: {
    color: '#fff',
    textAlign: 'center'
  },
  userText: {
    width: '100%',
    marginTop: 10,
    textAlign: 'center',
    // marginLeft: '20%',
    fontSize: 16,
    fontWeight: '600'
  },
  userText2: {
    width: '100%',
    marginTop: 10,
    textAlign: 'left',
    marginLeft: '20%',
    fontSize: 16,
    fontWeight: '600'
  }

});

export default Library;
