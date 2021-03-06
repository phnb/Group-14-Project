import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import store from 'react-native-simple-store'

// Set cookie
function setCookie(map){
  let cookie = map['set-cookie']
  if(cookie.includes('Path=/;')){
      let strArr = cookie.split('Path=/;')
      cookie = strArr.join('')
      cookie += '; Path=/'
  }
  store.save('cookie',cookie)
  global.cookie = cookie
}

// Login page implemented 
const LoginView = ({navigation}) => {
  const [username, OnchangeUsername] = useState('');
  const [pwd, OnchangePwd] = useState('');
  const [border1, onChangeBorder1] = React.useState(false);
  const [border2, onChangeBorder2] = React.useState(false);

  // Navigate to change password page
  function forgetpasssword(username) {
    navigation.navigate('ChangePwd');
  }

  // Submit person information to login the application
  function submit(username, pwd) {
    fetch('http://10.0.2.2:8000/auth/signin/', {
      method: 'post',
      body: JSON.stringify({
        username: username,
        password: pwd,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response =>{
        let map = response.headers.map;
        setCookie(map);
        return response.json();
      })
      .then(function (data) {
        if (!data.success) {
          Alert.alert(
            "sorry!",
            "password or username is error!",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate('OnBoarding');
                }
              }
            ]
          );
        }
        else{
          let account_id = data["default_account_id"];
          global.accountId = account_id;
          global.username = username;
          global.uid = data["uid"];
          global.email = data["email"];
          global.planId = data["default_plan_id"];
          OnchangePwd('');
          OnchangeUsername('');
          navigation.navigate('Homepage', {screen:'Home', params:{accountId:account_id, username:username}});
        }
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.rectangular1}>
        <Text style={styles.name}>Username</Text>
        <TextInput
          placeholder={'Enter your username or email address'}
          clearButtonMode={'while-editing'}
          style={[
            styles.username,
            {
              borderColor: border1
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border1 ? 2 : 1,
            },
          ]}
          onChangeText={text => OnchangeUsername(text)}
          onFocus={() => onChangeBorder1(true)}
          onBlur={() => onChangeBorder1(false)}
          value={username}
        />
        <Text style={styles.pass}>Password</Text>
        <TextInput
          placeholder={'Enter your password'}
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          selectionColor={'black'}
          keyboardAppearance={'dark'}
          style={[
            styles.password,
            {
              borderColor: border2
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border2 ? 2 : 1,
            },
          ]}
          onChangeText={text => OnchangePwd(text)}
          onFocus={() => onChangeBorder2(true)}
          onBlur={() => onChangeBorder2(false)}
          value={pwd}
        />
        <View style={styles.button}>
          <Button
            onPress={() => submit(username, pwd)}
            color="rgba(63,135,130,255)"
            title="Sign in"
          />
        </View>
        <View style={styles.forgetButton}>
          <Button
            onPress={() => forgetpasssword(username)}
            color="#BCBCBC"
            title="Forget password?"
          />
        </View>
      </View>
      <Image source={require('./imgs/icon.jpeg')} style={styles.iconStyle} />
    </View>
  );
};

// Login page UI style
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(66,150,144,1)',
  },
  login: {
    /* login */
    position: 'absolute',
    width: 301,
    height: 60,
    top: 20,
    left: 56,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  rectangular1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 360,
    height: 550,
    top: 150,
    left: 25,

    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 40,
    elevation: 8,
  },
  iconStyle: {
    width: 120,
    height: 120,
    marginTop: 70,
    marginBottom: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    /* NAME */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 80,
    left: 30,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  username: {
    /* userneame*/
    position: 'absolute',
    width: 290,
    height: 40,
    top: 110,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  pass: {
    /* passwordText */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 190,
    left: 30,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  password: {
    /* password */
    position: 'absolute',
    width: 290,
    height: 40,
    top: 220,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    /* Submit */
    position: 'absolute',
    width: 200,
    height: 48,
    top: 300,
    left: 70,

    backgroundColor: 'rgba(62, 124, 120, 0.1)',
    borderRadius: 40,
  },
  forgetButton: {
    /* Submit */
    position: 'absolute',
    width: 200,
    height: 48,
    top: 360,
    left: 70,

    backgroundColor: 'rgba(188,188,188,0.2)',
    borderRadius: 40,
  },
});

export default LoginView;
