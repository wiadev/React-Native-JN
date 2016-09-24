import React, { Component } from 'react';
import {
  TextInput,
  Text,
  LayoutAnimation,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import { Base, TextBase } from 'panza';
import * as actions from './actions';
import * as selectors from './selectors';
import { Colors, IconButton } from '../UI';
import { constants } from '../settings';

class LoginScreen extends Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    loginError: React.PropTypes.string,
    showLogin: React.PropTypes.bool,
    showConfirmEmail: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    loginWithFB: React.PropTypes.func,
    confirmEmail: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    const dims = Dimensions.get('window');
    this.width = dims.width;
    this.height = dims.height;
    this.state = { email: '' };
    this.onConfirmEmailPress = this.onConfirmEmailPress.bind(this);
    this.openRules = this.openRules.bind(this);
    this.openTerms = this.openTerms.bind(this);
  }

  onConfirmEmailPress() {
    this.props.confirmEmail(this.state.email);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.showLogin !== this.props.showLogin) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }

  openUrl(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Failed to open link');
      }
    });
  }

  openRules() {
    this.openUrl(constants.URLS.rules.web);
  }

  openTerms() {
    this.openUrl(constants.URLS.terms.web);
  }

  render() {
    const { loginError, loading, showLogin, showConfirmEmail, loginWithFB } = this.props;
    const showIndicator = loading || !showLogin;
    return (
      <Base flex={1} justify="center" align="center" backgroundColor={Colors.secondaryDark}>
        <Image
          source={require('../img/Login-BG.png')}
          style={{ flex: 1, width: this.width, height: this.height }}
          resizeMode={'stretch'}
        >
          <Base backgroundColor={'transparent'} justify="center" align="center" flex={1}>
            <Image
              source={require('../img/LogoWhite.png')}
              resizeMode={'contain'}
            />
            {showIndicator ?
              <Base mt={3}>
                <ActivityIndicator color={Colors.white} size="large" animating={showIndicator} />
              </Base>
              :
              <Base px={3} mt={3}>
                {showConfirmEmail ?
                  <Base justify={'center'} flex={1}>
                    <TextBase textAlign={'center'} color={Colors.white} fontSize={4}>
                      Please enter your university email
                    </TextBase>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor={'rgba(255,255,255,0.4)'}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(text) => this.setState({ email: text })}
                      value={this.state.email}
                    />
                    <TextBase textAlign={'center'} color={Colors.white} fontSize={5}>
                      DO NOT bully or specifically target others. This includes but is not limited to defaming, abusing, harassing, stalking, and threatening others.
                    </TextBase>
                    <IconButton borderWidth={1} mt={2} color={Colors.white} label="Confirm" onPress={this.onConfirmEmailPress} />
                  </Base>
                  :
                  <Base>
                    <IconButton
                      selected
                      flex={1}
                      color={Colors.facebook}
                      icon={'logo-facebook'}
                      iconSize={18}
                      iconStyle={{ marginTop: 4, marginRight: 10 }}
                      label="Login with Facebook"
                      onPress={loginWithFB}
                    />
                    <TextBase textAlign={'center'} color={`${Colors.white}AA`} fontSize={5} mt={2}>
                      By pressing "Login with Facebook", you agree to the&nbsp;
                      <TextBase color={Colors.primary} onPress={this.openRules}>
                        Rules&nbsp;
                      </TextBase>
                      and&nbsp;
                      <TextBase color={Colors.primary} onPress={this.openTerms}>
                        Terms and Conditions.
                      </TextBase>
                    </TextBase>
                  </Base>
                }
                <Base mt={2}>
                  <TextBase textAlign="center" color={Colors.white} fontSize={4}>
                    {loginError}
                  </TextBase>
                </Base>
              </Base>
            }
          </Base>
        </Image>
      </Base>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    fontSize: 18,
    color: Colors.white,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    marginVertical: 16
  }
});

function mapStateToProps(state) {
  return {
    loginError: selectors.getLoginError(state),
    loading: selectors.getLoggingIn(state),
    showLogin: selectors.getInitComplete(state),
    showConfirmEmail: selectors.getLoginComplete(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginWithFB: () => dispatch(actions.loginWithFB()),
    confirmEmail: (email) => dispatch(actions.confirmEmail(email))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
