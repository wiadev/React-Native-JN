import React from 'react';
import { connect } from 'react-redux';
import { Base, TextBase } from 'panza';
import * as actions from './actions';
import mockData from '../mockData';
import { Colors, ContentRow, Avatar, ChatList, BackgroundImage } from '../UI';
import { rebase } from '../app/actions'
import _ from 'lodash'
import * as profileActions from './../profile/actions';

class MessagesScreen extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    matches: React.PropTypes.arrayOf(React.PropTypes.object),
    chats: React.PropTypes.arrayOf(React.PropTypes.object),
    goToChat: React.PropTypes.func,
    numUnread: React.PropTypes.number
  };
  static defaultProps = {
    matches: mockData.matches,
    chats: mockData.chats,
    numUnread: 0
  };
  
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {

  
   
    this.props.loadFriends();
    this.props.loadChats();  
    
    const { numUnread } = this.props;
    if (numUnread && numUnread > 0) {
      this.props.navigator.setTabBadge({
        badge: numUnread
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { numUnread } = this.props;

    if (prevProps.numUnread !== numUnread) {
      this.props.navigator.setTabBadge({
        badge: numUnread > 0 ? numUnread : null
      });
    }
    
  }



  render() {
    const { goToChat, chats, matches } = this.props;
    return (
      <BackgroundImage
        source={require('../img/Messages-BG.png')}
      >
        {/*<View style={{ backgroundColor: Colors.secondaryDark, height: 20 }} />*/}
        <ChatList
          renderHeader={() => (
            <Base flex={1} pt={2}>
              <ContentRow
                borderTop={false}
                title={`New Matches (${matches.length})`}
                titleColor={`${Colors.white}AA`}
              >
                {

                  matches.map(match => (
                    match.user ? 
                    <Avatar
                      key={match.key}
                      onPress={() => goToChat(match)}
                      picture={match.user.avatar}
                      title={match.user.name}
                      size={60}
                      border={false}
                      titleProps={{
                        style: { backgroundColor: 'transparent' },
                        color: Colors.white
                      }}
                    />
                    : 
                    null
                  ))
                }
              </ContentRow>
              <Base px={2} pt={1} pb={2}>
                <TextBase color={`${Colors.white}AA`} bold fontSize={5} style={{ backgroundColor: 'transparent'}}>
                  Messages
                </TextBase>
              </Base>
            </Base>
          )}
          goToChat={goToChat}
          chats={chats}
        />
      </BackgroundImage>

    );
  }
}

const mapStateToProps = (state) => ({
  numUnread: actions.getNumUnread(state),
  currentUser: state.currentUser,
  matches: profileActions.getNewMatches(state),
  friends: profileActions.getFriends(state),
  chats: actions.getChats(state)
});
export default connect(mapStateToProps,
  (dispatch, ownProps) => ({
    goToChat: (chat) => dispatch(actions.goToChat(chat, ownProps.navigator)),
    loadFriends:() => dispatch(profileActions.loadFriends()),
    loadChats:() => dispatch(actions.loadChats()),
    setFriends:(friends) => dispatch(profileActions.setFriends(friends))
  })
)(MessagesScreen);
