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
  Keyboard, 
  TextInput
} from 'react-native';

import axios from 'axios';
import MainStore from './store'
import {observer} from 'mobx-react'
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import ModalSelector from 'react-native-modal-selector'
import publicIP from 'react-native-public-ip';
import Library from './library';

// import MainStore from './store';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const MainPage = observer(
  class MainPage extends React.Component{


    constructor(props){
      super(props)
      this.state = {
        chosen: {},
        show : 0,
        group: MainStore.library.groupNames[0],
        group2: MainStore.library.groupNames[0],
        date: null,
        ip: "",
        title : MainStore.title,
        password: "",
        keyboardOffset: screenHeight *14/100,
      }
    }



    

    getLibrary = () => {
      let body = {
        library: MainStore.library.libName
      }
      // alert(JSON.stringify(body))
      axios.post("http://localhost:5000/library/get", body, {
        headers: {
          token : MainStore.token
        }
      })
      .then(res => {
        // alert(JSON.stringify(res.data))

        MainStore.library = res.data
        // this.props.navigation.navigate("Seats")
      })
      .catch(err => {
        alert(JSON.stringify(err.response.data))
      })
    }

    getAll = (input) => {
        let body = {
          group : input,
          seatCollectionName:  MainStore.library.seatCollectionName
        }
        axios.post("http://localhost:5000/seat/all", body ,{
            headers: {
                token : MainStore.token
            }
        })
        .then(res=> {
            MainStore.chairs = res.data
        })
        .catch(err => alert("Bir hata meydana geldi"))
    }
    // getAll = () => {
    //   let body = {
    //     group:"1"
    //   }
    //   axios.post("http://localhost:5000/seat/all",body,{
    //     headers: {
    //         token : MainStore.token
    //       }
    // })
    // .then(res=> {
    //   alert(res);
    //   MainStore.desks = res.data.result //which group?
    //   alert(MainStore.desks);
    // })
    // .catch(error => alert("error while getting desk from server"))
    // }

    handleWaiting = (email, seatNum) => {
        if(this.state.chosenNum === 0){
          let body = {
            email: email,
            seatNum: seatNum
          }
          axios.post("http://localhost:5000/seat/waiting", body, {
              headers: {
                  token : MainStore.token
              }
          })
          .then(() =>  this.getAll(this.state.group))
          .catch((err) => {Alert.alert(err.msg)})
        }
        else{
          Alert.alert("")
        }
        
    }

    handleHold = (email, seatNum) => {
      if(this.state.password === ""){
        alert("Lutfen Sifre Giriniz")
        return
      }
      let body = {
          email: email,
          seatNum: seatNum,
          ipAdress: this.state.ip,
          seatCollectionName: MainStore.library.seatCollectionName,
          library : MainStore.library.libName,
          password : this.state.password,
          group: this.state.group
      }
      // alert(JSON.stringify(body))
      axios.post("http://localhost:5000/seat/hold", body, {
          headers: {
              token : MainStore.token
          }
      })
      .then(() => {
        this.getAll(this.state.group)
        this.setState({show: 2})
        this.getUser()
      })
      .catch(err => err.response.data.errors.map(item => {
        Alert.alert(item.msg)
      }))
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

    


    handleUnhold = (email, seatNum) => {
      let body = {
          seatNum : seatNum,
          email : email,
          seatCollectionName: MainStore.user.seatCollectionName
      }
      axios.post("http://localhost:5000/seat/unhold", body, {
          headers: {
              token : MainStore.token
          }
      })
      .then(() =>  {
        this.getAll(this.state.group)
        this.setState({show: 0})
        this.getUser()
        })
      .catch((err) => err.response.data.errors.map(item => {
        Alert.alert(item.msg)
      }))
    
    }

    componentDidMount(){
      // this.getUser()
      publicIP()
      .then(ip => {
        this.setState({ip: ip})
      })
      if(MainStore.library){
        if(!MainStore.user.isAvailable){
          this.setState({show : 2})
        }
      }
      else{
        this.props.navigation.navigate("library")
      }
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide,
      );
      // setInterval(this.getLibrary, 60000)
    }

    _keyboardDidShow = (event) => {
        this.setState({keyboardOffset:event.endCoordinates.height})
    }

    _keyboardDidHide = () =>  {
        this.setState({
            keyboardOffset: screenHeight *14/100,
        })
    }
    
    selectorData = () => {
      data = []
      MainStore.library.groupNames.map(item =>{
        data = [
          ...data, 
          {key : item, label: item}
        ]
      })
      return(data)
    }

    handleVirtual = (email, seatNum) => {
      let body = {
          email: email,
          seatCollectionName: MainStore.library.seatCollectionName,
          library : MainStore.library.libName
      }
      // alert(JSON.stringify(body))
      axios.post("http://localhost:5000/seat/addVirtual", body, {
          headers: {
              token : MainStore.token
          }
      })
      .then(() => {
        this.getUser()
      })
      .catch(err => 
        alert(JSON.stringify(err.response.data))
      )
    }

    handleDeleteVirtual = (email) => {
      let body = {
          email : email,
          seatCollectionName: MainStore.user.seatCollectionName
      }
      axios.post("http://localhost:5000/seat/deleteVirtual", body, {
          headers: {
              token : MainStore.token
          }
      })
      .then(() =>  {
        this.setState({show: 0})
        this.getUser()
        })
      .catch((err) => err.response.data.errors.map(item => {
        Alert.alert(item.msg)
      }))
    
    }



  

    render (){
      
      const renderUsers = MainStore.chairs.map(chair => {
        let colorName = "black"
        if(chair.isAvailable === 1){
          return ((
            <View style = {styles.wrapper}>
              <TouchableOpacity style = {styles.userContainer} onPress = {()=>{
                    this.setState({chosen : chair})
                    this.setState({show : 1})
                    let date = new Date();
                    this.setState({date : date})
                    // Alert.alert(this.state.show)
                }} >
                {/* <Text style = {styles.userText}>{user.firstname} {user.lastname}</Text> */}
                <Icon name = "chair" size ={24} color = {"green"}/>
                <Text style= {styles.userText}>{chair.seatNum}</Text>
              </TouchableOpacity>  
            </View>
          ))
          }
          else if(chair.isAvailable === 0){
            return ((
              <View style = {styles.wrapper}>
                <View style = {styles.userContainer}>
                  <Icon name = "chair" size ={24} color = {'grey'}/>
                  <Text style= {styles.userText}>{chair.seatNum}</Text>
                </View>  
              </View>
            ))
        }
        
      })

      const showChosen = () => {
        let internalNow = new Date(Date.parse(MainStore.user.timeStarted))
        let hour = internalNow.getHours()
        let minute = internalNow.getMinutes()
        // alert(MainStore.user.isVirtual)
        if(hour < 10){
          hour = "0" + hour
        }
        if(minute < 10){
          minute = "0" + minute
        }
        if(MainStore.user.isSeated && MainStore.user.library === MainStore.library.libName && !MainStore.user.isVirtual){
          return ((
            <>
              <View style = {styles.userContainer3}>
                <Text style = {styles.userText}>{MainStore.user.firstname} {MainStore.user.lastname}</Text>
                <Text style = {styles.userText2}>Oturulan Grup: {MainStore.user.group}</Text>
                <Text style = {styles.userText2}>Oturma Saati : {hour}.{minute}</Text>
                <Text style = {styles.userText2}>Oturulan Masa: {MainStore.user.seatNum}</Text>
                <TouchableOpacity style=  {styles.userButton} onPress = {() => {
                    this.handleUnhold(MainStore.user.email, MainStore.user.seatNum)
                    }}>
                  <Text style = {styles.userDelete}>Kalk !!</Text>
                </TouchableOpacity>
              </View>
            </>
          ))
        }
        else if(MainStore.user.isSeated && MainStore.user.isVirtual  && MainStore.user.library === MainStore.library.libName){
          return ((
            <>
              <View style = {styles.userContainer3}>
                <Text style = {styles.userText}>{MainStore.user.firstname} {MainStore.user.lastname}</Text>
                <Text style = {styles.userText2}>Kutuphane: {MainStore.user.library}</Text>
                <Text style = {styles.userText2}>Oturma Saati : {hour}.{minute}</Text>
                <TouchableOpacity style=  {styles.userButton2} onPress = {() => {
                    this.handleDeleteVirtual(MainStore.user.email)
                    }}>
                  <Text style = {styles.userDelete}>Sanal Masadan Kalk !!</Text>
                </TouchableOpacity>
              </View>
            </>
          ))
        }
        else if(MainStore.user.isSeated ){
          return ((
            <View style = {styles.userContainer4}>
              <Text style = {styles.userText2}>Kutuphane: {MainStore.user.library}</Text>
              <Text style = {styles.userText2}>Oturulan Masa: {MainStore.user.seatNum}</Text>
            </View>
            ))
        }
        else if(this.state.show === 1){
          return ((
              <View style = {styles.userContainer2}>
               
                <Text style = {styles.userText2}>Masa Numarasi :        {this.state.chosen.seatNum}</Text>
                <Text style = {styles.userText2}></Text>
                <Text style = {styles.userText2}></Text>
                <TextInput 
                  placeholder = "Kutuphane Sifresi" 
                  style = {{width: '90%', marginLeft: '10%', padding: 10,borderRadius: 20 ,textAlign: 'center', borderWidth: 1, position: 'absolute', bottom: this.state.keyboardOffset}}
                  onChangeText = {(text) => {
                    this.setState({password: text})
                  }}
                />
                {/* <Text style = {styles.userText2}>Baslama Saati :        {hour}.{minute}</Text> */}
                <TouchableOpacity style=  {styles.userButton} onPress = {() => {
                  this.handleHold(MainStore.user.email, this.state.chosen.seatNum)
                  // this.handleSit(MainStore.user.email, internalNow, this.state.chosen.seatNum)
                }}>
                  <Text style = {styles.userDelete}>Bu Masa Artik Benim</Text>
                </TouchableOpacity>
                <TouchableOpacity style=  {styles.userButton2} onPress = {() => {
                    this.handleVirtual(MainStore.user.email, this.state.chosen.seatNum)
                  }}>
                  <Text style = {styles.userDelete}>Sanal Masa Ac</Text>
                </TouchableOpacity>
              </View>
          ))
        } else {
          return ((
            <View style = {styles.userContainer2}>
              <TouchableOpacity style=  {styles.userButton2} onPress = {() => {
                this.handleVirtual(MainStore.user.email, this.state.chosen.seatNum)
              }}>
                <Text style = {styles.userDelete}>Sanal Masa Ac</Text>
              </TouchableOpacity>
            </View>
        ))
        }
        
      }
      return (
        // data= {this.selectorData()}
        //       onChange = {(option) => {
        //         this.getAll(option.key)
        //         this.setState({group: option.key})
        //         }}
        <>
          <StatusBar translucent barStyle = "light-content"  backgroundColor='magenta' />
          <SafeAreaView style = {styles.container}>

            <View style = {{marginTop: 20,flexDirection: 'row', marginLeft: '5%'}}>  

              <ModalSelector
               data= {this.selectorData()}
               backdropPressToClose = {true}
               overlayStyle = {{borderWidth: 0}}
               style = {{ width: '80%', marginLeft: '10%', border: 'none'}}
                onChange = {(option) => {
                  this.getAll(option.key)
                  this.setState({
                    group: option.key,
                    group2: option.key
                  
                  })
                  
                  }}
                initValue= {this.state.group2+ "     ▼" }
                selectTextStyle = {{color: 'black', fontSize: 72}}
                sectionTextStyle= {{color: 'black', fontSize: 72}}
                initValueTextStyle = {{color: 'black', fontSize: 24}}
                />

            </View>
            
                

            <View style = {styles.container2}>
            {renderUsers}
            </View>
            {showChosen()}
          </SafeAreaView>
        </>
      )
    }
  }
)

const styles = StyleSheet.create({
  StatusBar:{ 
    // height: Constants.statusBarHeight,
    backgroundColor: 'rgba(22,7,92,1)'
  },
  container : {
    height : screenHeight,
    width: screenWidth,
    backgroundColor: '#fff'
  },
  container2: {
    marginTop: 10,
    height : screenHeight*80/100,
    width: screenWidth * 50 / 100,
    marginLeft: '30%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  header: {
    // color: "#5572b5",
    fontSize: 24, 
    top: 2*screenHeight/100,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'red',
    backgroundColor: 'black'
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
    // height: 14*screenHeight/100,
    marginLeft: '10%',
    position: 'absolute',
    bottom: screenHeight*20/100
    // position: 'absolute'
    
    // marginTop: 50,
    // justifyContent: 'center',
  },
  userContainer22: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    width: 80*screenWidth/100,
    height: 14*screenHeight/100,
    marginLeft: '10%',
    position: 'absolute',
    bottom: screenHeight*20/100
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
    marginLeft: '10%',
    // marginTop: 50,
    justifyContent: 'center',
    position: 'absolute',
    bottom: screenHeight*20/100
    // bottom: 0
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
    bottom: screenHeight*20/100
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

  },
  userButton2: {
    backgroundColor: 'green',
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

export default MainPage;
