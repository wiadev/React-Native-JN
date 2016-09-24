import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import AppIntro from 'react-native-app-intro';
import { Icon } from 'panza';
import * as app from '../app';
import Colors from './Colors';
import BackgroundImage from './BackgroundImage';

class OnboardingScreen extends Component {
  static propTypes = {
    goToLogin: React.PropTypes.func
  };
  constructor(props) {
    super(props);
    const dim = Dimensions.get('window');
    this.width = dim.width;
    this.height = dim.height;
  }
  render() {
    const { goToLogin } = this.props;
    const imageStyle = { height: this.height / 2, marginTop: 16, resizeMode: 'contain' };
    return (
      <BackgroundImage source={require('../img/Login-BG.png')}>
        <AppIntro
          onDoneBtnClick={goToLogin}
          onSkipBtnClick={goToLogin}
          dotColor={'rgba(255,255,255,0.2)'}
          activeDotColor={Colors.primary}
          rightTextColor={Colors.primary}
          leftTextColor={Colors.primary}
        >
          <View style={styles.slide}>
            <Icon name={'ios-eye-off'} size={110} color={'rgba(255,255,255,0.7)'} />
            <Text style={styles.title}>
              Remember ONLY your posts are anonymous, not your comments!
            </Text>
          </View>
          <View style={styles.slide}>
            <Icon name={'ios-contacts'} size={110} color={'rgba(255,255,255,0.7)'} />
            <Text style={styles.title}>You can like other students and if you match, start chatting!</Text>
          </View>
          <View style={styles.slide}>
            <Icon name={'ios-key'} size={110} color={'rgba(255,255,255,0.7)'} />
            {/*<Image source={require('../img/onboarding-look.png')} style={imageStyle} />*/}
            <Text style={styles.title}>Build your Juno score by getting more likes on your journey to success</Text>
          </View>
        </AppIntro>
      </BackgroundImage>

    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
  },
  title: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Avenir',
    fontWeight: '800',
  }
});

export default connect(null,
  dispatch => ({
    goToLogin: () => dispatch(app.actions.changeAppRoot(app.constants.LOGIN_ROOT))
  })
)(OnboardingScreen);
