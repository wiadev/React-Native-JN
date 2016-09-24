import React from 'react';
import * as firebase from 'firebase';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Base, LoadingPage, SecondaryText } from 'panza';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { actions as homeActions } from '../home';
import * as actions from './actions';
import icons from '../img/appIcons';
import mockData from '../mockData';
import * as instagram from '../lib/instagram';
import * as facebook from '../lib/facebook';
import { Colors, GradientImage, ProfileHeader, ContentRow, Avatar, IconButton } from '../UI';
import { rebase } from '../app/actions'
import _ from 'lodash'


class ProfileScreen extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    user: React.PropTypes.object,
    friends: React.PropTypes.arrayOf(React.PropTypes.object),
    photos: React.PropTypes.arrayOf(React.PropTypes.string),
    photosLoading: React.PropTypes.bool,
    isOwner: React.PropTypes.bool,
    likeUser: React.PropTypes.func,
    openInstagram: React.PropTypes.func,
    igError: React.PropTypes.string,
    loadInstagram: React.PropTypes.func,
    loginWithInstagram: React.PropTypes.func,
    loadFriends: React.PropTypes.func,
    goToUser: React.PropTypes.func,
    SnapchatChange: React.PropTypes.func,
    headerHeight: React.PropTypes.number
  };
  static defaultProps = {
    headerHeight: 370,
    user: {},
    photos: [],
    friends: mockData.friends,
    facebook:{}
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderInstagram = this.renderInstagram.bind(this);
    this.width = Dimensions.get('window').width;
    this.state = {
      friends: [],
      user: {},
      university : {},
      isFriend: false,
      loading: true
    };
  }

  componentDidMount() {
    const { isOwner } = this.props;
    this.props.navigator.setButtons({
      rightButtons: isOwner ? null : [{ icon: icons.like, id: 'like', }],
      leftButtons: [{
        icon: icons.close,
        id: 'close'
      }]
    });

    if (isOwner) {
      this.props.loadFacebookFriends();
    }

    firebase.database().ref(`/users/${this.props.user._id}`).once('value', (snapshot) => {
      let user = snapshot.val();
      if(user.instagram){
         this.props.loadInstagram(user.instagram);
      }
      this.setState({user: user});

      console.log(this.props.feedsName[user.universityFeed], 'user.universityFeed', user.universityFeed)
      this.setState({university: this.props.feedsName[user.universityFeed]});
      this.setState({loading: false})

    })


    firebase.database().ref(`/friends/${this.props.user._id}`)
    .orderByChild("heart").equalTo(true)
    .on('value', (snapshot) => {
      let friends =  _.map(snapshot.val(), (obj) => obj);
      _.reverse(friends);

      isFriend = _.findIndex(friends, (obj) => obj.user && obj.user._id === this.props.currentUser._id) != -1;

      this.setState({isFriend: isFriend});
      this.setState({friends: friends});

      if (!isOwner) {
        this.props.setButtonsHeart(isFriend);
      }

    })


  }

  componentDidUpdate(_, prevState) {
    const { isFriend } = this.state;

  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'like') {
        this.props.likeUser(this.props.currentUser, this.props.user, this.props.feedsName);
      }
      else if (event.id === 'close') {
        this.props.navigator.dismissModal();
      }
    }
  }

  renderInstagram() {
    const { user } = this.state;
    const { photos, photosLoading, igError, openInstagram } = this.props;
    if (!user.instagram) return null;
    return (
      <ContentRow title={'Instagram Photos'} onExpand={openInstagram}>
        {
          photosLoading && !photos.length ?
            <LoadingPage />
            :
            igError && !photos.length ?
              <SecondaryText light>
                {igError}
              </SecondaryText>
              :
              photos.map((photo, i) => (
                <Image
                  key={i}
                  source={{ uri: photo }}
                  style={styles.photo}
                />
              ))
        }
      </ContentRow>
    );
  }

  render() {
    const { photos, photosLoading, goToUser, openInstagram, headerHeight,
      loginWithInstagram, isOwner, SnapchatChange, currentUser, InstagramChange } = this.props;
    const { user , friends, university,  isFriend, loading } = this.state;
    return (
      <ParallaxScrollView
        contentBackgroundColor={Colors.white}
        parallaxHeaderHeight={headerHeight}
        renderBackground={() =>
          <View style={{ width: this.width, height: headerHeight, backgroundColor: Colors.secondary }} />
        }
        renderForeground={() => (
          <Base px={2} pt={2} justify={'flex-end'} flex={1}>
            <View style={styles.profilePic}>
              <Image
                source={{ uri: user.avatar }}
                style={styles.profilePic}
              />
            </View>
          </Base>
        )}
      >
        <Base>
          <ProfileHeader
            user={user}
            isOwner={isOwner}
            university={university}
            onSnapchatChange={(snapchat) => SnapchatChange(snapchat, currentUser)}
            onChangeInstagram={(snapchat) => InstagramChange(snapchat, currentUser)}
            pt={2}
            pb={3}
          />
          {
            this.renderInstagram()
          }
        </Base>
      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  photo: {
    width: 140,
    height: 140,
    marginRight: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGrey,
    borderRadius: 6,
    resizeMode: 'cover'
  },
  profilePic: {
    flex: 1,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 8 },
    backgroundColor: 'white'
  }
});

export default connect(
  (state, ownProps) => ({
    currentUser: state.currentUser,
    feeds: state.feeds,
    feedsName: state.feedsName,
    isOwner: state.currentUser._id === ownProps.user._id,
    photos: instagram.getPhotos(state),
    username: instagram.getUsername(state),
    photosLoading: instagram.getLoading(state),
    igError: instagram.getError(state),
    friends: actions.getFriends(state),
  }),
  (dispatch, ownProps) => ({
    goToUser: (user) => dispatch(homeActions.goToUser(user, ownProps.navigator)),
    SnapchatChange: (snapchat, currentUser) => dispatch(actions.SnapchatChange(snapchat, currentUser)),
    InstagramChange: (instagram, currentUser) => dispatch(actions.InstagramChange(instagram, currentUser)),
    loadInstagram: (username) => dispatch(instagram.loadInstagram(username)),
    loginWithInstagram:  () => dispatch(instagram.loginWithInstagram()),
    likeUser: (currentUser, user, feedsName) => dispatch(actions.likeUser(currentUser, user, feedsName)),
    loadFacebookFriends: () => dispatch(facebook.loadFriends()),
    loadFriends:(blocks, next) => dispatch(actions.loadFriends(blocks, false ,ownProps.user, next)),
    setButtonsHeart:(isFriend)=> dispatch(actions.setButtonsHeart(isFriend, ownProps.navigator)),
  })
)(ProfileScreen);
