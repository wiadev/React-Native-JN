import React from 'react';
import { connect } from 'react-redux';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { Base, TextBase, Icon } from 'panza';
import icons from '../img/appIcons';
import mockData from '../mockData';
import { Colors, Composer, OpenableImage, ChatNavBar } from '../UI';
import { rebase } from '../app/actions';
import * as actions from './actions';
import { actions as homeActions } from '../home';
import _ from 'lodash'

class ChatScreen extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    refresh: React.PropTypes.func,
    sendMessage: React.PropTypes.func,
    goToUser: React.PropTypes.func,
    loadMessages: React.PropTypes.func,
    chat: React.PropTypes.object,
    messages: React.PropTypes.array

  };
  static defaultProps = {
    refresh: () => new Promise(resolve => resolve()),
    sendMessage: () => {},
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onRefresh = this.onRefresh.bind(this);
    this.renderMessageImage = this.renderMessageImage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {

    this.props.loadMessages();


    this.props.navigator.setButtons({
      leftButtons: [{
        icon: icons.close,
        id: 'close'
      }]
    });
  }
  
  componentWillUnmount() {
    this.props.stopLoadMessages();
  }
  


  onRefresh() {
    this.setState({ refreshing: true });
    this.props.refresh().then(() => {
      this.setState({ refreshing: false });
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal();
      }
    }
  }


  sendMessage(message){
    this.props.sendMessage(message[0]);
  }

  renderMessageImage(props) {
    return (
      <OpenableImage style={styles.image} source={{ uri: props.currentMessage.image }} />
    );
  }

  render() {
    const { messages, chat:{ user }, currentUser, sendMessage, goToUser, navigator, ...props } = this.props;
    return (
      <View style={styles.container}>
        <ChatNavBar
          onClosePress={navigator.dismissModal}
          user={user}
          onUserPress={() => goToUser(user)}
        />
        <Composer
          messages={messages}
          user={currentUser}
          onSend={this.sendMessage}
          renderMessageImage={this.renderMessageImage}
          {...props}
        />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  }
});

export default connect(
  (state) => ({
    currentUser: state.currentUser,
    messages: actions.getMessages(state)
  }),
  (dispatch, ownProps) => ({
    sendMessage: (message) => dispatch(actions.sendMessage(message, ownProps.chat)),
    goToUser: (user) => dispatch(homeActions.goToUser(user, ownProps.navigator)),
    loadMessages:() => dispatch(actions.loadMessages(ownProps.chat)),
    stopLoadMessages:() => dispatch(actions.stopLoadMessages(ownProps.chat))
  })
)(ChatScreen);
