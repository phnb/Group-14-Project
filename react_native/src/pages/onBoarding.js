import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

// OnBoarding page implemented (can direct users to login page or registration page)
const OnBoarding = ({navigation}) => {
  return (
    <View>
      <View style={group2.rectangle1}>
        <View style={group2.rectangle2}>
          <Image
            source={require('./imgs/image193.png')}
            style={image.image193}
          />
          <Image
            source={require('./imgs/image194.png')}
            style={image.image194}
          />
          <Image
            source={require('./imgs/image195.png')}
            style={image.image195}
          />
          <View style={group2.ellipse1} />
          <View style={group2.ellipse2} />
          <View style={group2.ellipse3} />
        </View>
      </View>
      <TouchableOpacity
        style={group1.frame}
        onPress={() => navigation.navigate('Registration')}
      >
        <Text style={slogen.text2}>Get Started </Text>
      </TouchableOpacity>
      <Text style={slogen.text1}>Spend Smarter Save More</Text>
      <TouchableOpacity
        style={slogen.text3}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={slogen.text4}>Already Have Account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

// OnBoarding page UI style
const group1 = StyleSheet.create({
  frame: {
    /* Frame */
    position: 'relative',
    width: 358,
    height: 64,
    top: 630,
    left: 25,

    backgroundColor: 'rgba(63,135,130,255)',
    borderRadius: 40,
    elevation: 10,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rectangular1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 358,
    height: 48,
    top: 662,
    left: 25,

    backgroundColor: 'rgba(62, 124, 120, 0.1)',
    borderRadius: 40,
  },
  text: {
    /* Get Started */
    position: 'absolute',
    width: 98,
    height: 38,
    top: 645,
    left: 152,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});

const slogen = StyleSheet.create({
  text1: {
    /* spend smarter save more */
    position: 'absolute',
    width: 301,
    height: 76,
    top: 520,
    left: 56,

    color: 'rgb(67, 136, 131)',
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  text2: {
    /* spend smarter save more */
    position: 'absolute',
    width: 301,
    height: 76,
    top: 12,
    left: 34,

    color: "rgb(255,255,255)",
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  text3: {
    /* Already have account? Log In */
    position: 'absolute',
    width: 199,
    height: 17,
    top: 710,
    left: 100,

    backgroundColor: 'rgb(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  text4: {
    position: 'absolute',
    left: 6,
    color: 'rgb(68, 68, 68)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    // textAlign: 'center',
    textTransform: 'capitalize',

  },
});

const image = StyleSheet.create({
  image193: {
    /* image 193 */
    position: 'absolute',
    width: 375,
    height: 450.71,
    top: 34,
    left: 18,
  },
  image194: {
    /* image 194 */
    position: 'absolute',
    width: 98.05,
    height: 98.05,
    top: 54,
    left: 45,
  },
  image195: {
    /* image 195 */
    position: 'absolute',
    width: 97.12,
    height: 97.12,
    top: 88,
    left: 271,
  },
});

const group2 = StyleSheet.create({
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 414,
    height: 500,

    backgroundColor: 'rgb(238, 248, 247)',
  },
  rectangle2: {
    /* Rectangle 2 */
    position: 'absolute',
    width: 414,
    height: 500,
    visibility: 'hidden',

    backgroundColor: 'rgb(242, 251, 240)',
  },
  ellipse1: {
    /* Ellipse 1 */
    position: 'absolute',
    width: 628,
    height: 628,
    top: -28,
    left: -107,
    boxSizing: 'border-box',

    border: '1 solid rgb(255, 255, 255)',
  },
  ellipse2: {
    /* Ellipse 2 */
    position: 'absolute',
    width: 484,
    height: 482,
    top: -45,
    left: -35,
    boxSizing: 'border-box',

    border: '1 solid rgb(255, 255, 255)',
  },
  ellipse3: {
    /* Ellipse 3 */
    position: 'absolute',
    width: 360,
    height: 360,
    top: -106,
    left: -27,
    boxSizing: 'border-box',

    border: '1 solid rgb(255, 255, 255)',
  },
});

export default OnBoarding;
