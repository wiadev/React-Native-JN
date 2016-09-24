import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, Linking, Alert } from 'react-native';
import { connect } from 'react-redux';
import { TouchableRow, Base, TextBase } from 'panza';
import { actions as homeActions } from '../home';
import { Colors, CircleImage } from '../UI';
import * as constants from './constants';
import icons from '../img/appIcons';

class SettingsScreen extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    goToPosts: React.PropTypes.func,
    goToComments: React.PropTypes.func,
    ids: React.PropTypes.object,
    urls: React.PropTypes.object
  };
  static defaultProps = {
    ids: {
      facebook: '1333132033371275',
      snapchat: 'junoapp',
      instagram: 'junoapp',
      contact: 'hello@feellikejuno.com'
    },
    urls: constants.URLS
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.props.navigator.setButtons({
      leftButtons: [{
        icon: icons.close,
        id: 'close'
      }]
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal();
      }
    }
  }

  openUrl({ web, app }, id = '') {
    const url = app || web;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(`${url}${id}`);
      } else {
        Linking.canOpenURL(web).then(webSupported => {
          if (webSupported) {
            Linking.openURL(`${web}${id}`);
          } else {
            Alert.alert('Failed to open link');
          }
        });
      }
    });
  }

  renderRow(text, onPress) {
    return (
      <TouchableRow
        primaryText={text}
        onPress={onPress}
        height={50}
        backgroundColor={Colors.white}
        style={styles.borderBottom}
      />
    );
  }

  render() {
    const { goToPosts, goToComments, ids, urls } = this.props;
    return (
      <ScrollView style={styles.container}>
        <Base mb={2}>
          <Text style={styles.header}>
            My Stuff
          </Text>
          {this.renderRow('My Posts', goToPosts)}
          {this.renderRow('My Comments', goToComments)}
        </Base>
        <Base mb={2}>
          <Text style={styles.header}>
            Love Us On
          </Text>
          {this.renderRow('\uD83D\uDC4D Facebook', () => this.openUrl(urls.facebook, ids.facebook))}
          {this.renderRow('\uD83D\uDCF7 Instagram', () => this.openUrl(urls.instagram, ids.instagram))}
          {this.renderRow('\uD83D\uDC7B Snapchat', () => this.openUrl(urls.snapchat, ids.snapchat))}
        </Base>
        <Base mb={2}>
          <Text style={styles.header}>
            Important Stuff
          </Text>
          {this.renderRow('Contact Us', () => this.openUrl(urls.contact, ids.contact))}
          {this.renderRow('Rules and Info', () => this.openUrl(urls.rules))}
          {this.renderRow('Terms of Service', () => this.openUrl(urls.terms))}
          {this.renderRow('Privacy Policy', () => this.openUrl(urls.privacy))}
        </Base>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    margin: 16,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGrey
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGrey
  },
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToPosts: () => dispatch(homeActions.goToOwnPosts('posts', ownProps.navigator)),
  goToComments: () => dispatch(homeActions.goToOwnComments(ownProps.navigator)),
});

export default connect(null, mapDispatchToProps)(SettingsScreen);
