import _ from 'lodash';
import React from 'react';
import { View,
  TouchableOpacity, 
  Image,
  Text,
  RefreshControl, ActivityIndicator, StyleSheet, Platform, AppState } from 'react-native';
import {
  Base,
  Icon,
  LoadingPage
} from 'panza';
import { connect } from 'react-redux';
import * as selectors from './selectors';
import * as actions from './actions';
import { FILTERS } from './constants';
import mockData from '../mockData';
import { Colors, HomeNavBar, PostList, BackgroundImage } from '../UI';
import { rebase } from '../app/actions';
import FCM from 'react-native-fcm';
import * as profileActions from './../profile/actions';

class HomeScreen extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    filterId: React.PropTypes.string,
    feed: React.PropTypes.object,
    toggleFilter: React.PropTypes.func,
    openCreatePost: React.PropTypes.func,
    postsFilter: React.PropTypes.array,
    loading: React.PropTypes.bool,
    more: React.PropTypes.number,
    loadMore: React.PropTypes.func,
    refresh: React.PropTypes.func
  };

  static defaultProps = {
    postsFilter: [],//mockData.postIds.map(id => mockData.posts[id]),
    refresh: () => new Promise(resolve => resolve())
  };

  constructor(props) {
    super(props);
    this.openSideBar = this.openSideBar.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      refreshing: false
    };
  }


  onRefresh() {
    this.setState({ refreshing: true });
    //if(this.state.loadingMore  && this.props.more)
    if(this.props.more)
      this.props.loadMore();
    else
      this.setState({ refreshing: false });

  }

  onEndReached() {

    this.setState({ loadingMore: false, refreshing: false });
    
  }

  openSideBar() {
    this.props.navigator.toggleDrawer({
      side: 'left',
      animated: true,
      navigatorStyle: {
        statusBarTextColorScheme: 'light',
      }
    });
  }

  toggleFilter(){
    this.props.toggleFilter();
    this.props.loadPosts(this.props.feed, this.props.filterId === 'newest' ? 'hot': 'newest');
  }

  render() {
    const { filterId, feed, toggleFilter, openCreatePost, navigator, postsFilter, loading, more, currentUser , limit } = this.props;
    const hasPosts = postsFilter.length > 0;
    
    return (
      <BackgroundImage
        source={require('../img/Home-BG.png')}
        style={{ paddingBottom: 49 }}
        blurRadius={50}
      >
        <HomeNavBar
          onMenuPress={this.openSideBar}
          onFilterPress={this.toggleFilter.bind(this)}
          filter={FILTERS[filterId]}
          menuLabel={feed ? feed.label : ''}
        />
        {!hasPosts ? (
          loading ?
            <LoadingPage style={styles.absolute} />
            :
            <Base justify="center" align="center" style={styles.absolute}>
              <Text style={styles.text}>
                No Posts
              </Text>
            </Base>
        )
          :
          null
        }

        <PostList
          style={{ flex: 1 }}
          navigator={navigator}
          posts={postsFilter}
          limit={limit}
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              tintColor={`${Colors.white}90`}
            />
          }
          renderFooter={more && hasPosts ?
            () => <Base py={2} align={'center'}>
              <ActivityIndicator color={`${Colors.white}90`} size={'large'} animating={loading} />
            </Base>
            :
            () => <Base py={2} />
          }
        />
        {feed && feed.feed === currentUser.universityFeed ? (

          <TouchableOpacity activeOpacity={0.8} onPress={openCreatePost}>
            <View style={styles.actionButton}>
              <Icon name={'md-add'} color={Colors.white} />
            </View>
          </TouchableOpacity>
          )
          :
          null
        }
      </BackgroundImage>
    );
  }
}

const styles = StyleSheet.create({
  absolute: { marginTop: 50 ,  top: 0, left: 0, right: 0, bottom: 0 },
  text: {
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'transparent',
    fontSize: 18,
    textAlign: 'center'
  },
  actionButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
    elevation: 6,
    marginBottom: 12,
  }
});

class HomeScreenWrapper extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    feed: React.PropTypes.object,
    posts: React.PropTypes.arrayOf(React.PropTypes.object),
    postsFilter: React.PropTypes.arrayOf(React.PropTypes.object),
    limit: React.PropTypes.number,
    loadPosts: React.PropTypes.func
  };
  constructor(props) {
    super(props);

    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this._handleNotification = this._handleNotification.bind(this);
    

    this.state ={
      limit: 5,
      currentAppState: AppState.currentState
    }

  }

  componentDidMount() {

    // get posts university feed
    this.props.navigator.switchToTab();

    this.props.loadBlocks();
    this.loadPosts();

    if(Platform.OS === "ios")
      FCM.requestPermissions(); // for iOS
    
    FCM.getFCMToken().then(token => {
      this.props.updateToken(this.props.currentUser._id, token);    
    });
    
    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
      let currentAppState =  this.state.currentAppState
      setTimeout(() => {
        this._handleNotification(notif, currentAppState)
      }, 100);
    });

    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
      this.props.updateToken(this.props.currentUser._id, token);    
      // fcm token may not be available on first load, catch it here
    });

    AppState.addEventListener('change', this._handleAppStateChange);

    FCM.subscribeToTopic('/topics/foo-bar');
    FCM.unsubscribeFromTopic('/topics/foo-bar');

    //this.props.stopRetrievingData();
  }
  
  _handleNotification(notif, currentAppState){
    if(notif && notif._id  
        && currentAppState === 'background'){
      //if(notif.type =='heart')
      //  this.props.goToUser(notif);
      //else 
      if(notif.type =='comment')
        this.props.goToPost(notif);
    }
  }

  componentWillUnmount() {

    AppState.removeEventListener('change', this._handleAppStateChange);
    this.props.stopRetrievingData();

    // prevent leaking
    this.refreshUnsubscribe();
    this.notificationUnsubscribe();
  }
  
  _handleAppStateChange(currentAppState) {
    this.setState({ currentAppState });
  }

  loadPosts(){
    this.props.loadPosts(this.props.feed, this.props.filterId);

  }

  loadMore(){
    this.props.setState({limit: 10});
  }

  render() {
    const {posts, blocks, feed, filterId, postsLoading, more, goToPost, goToUser} = this.props;
    const postsFilter = _.filter(posts, (obj) =>  blocks.indexOf(obj.user._id) === -1)
    
    const { limit } = this.state;

    return (
      <HomeScreen
        postsFilter={postsFilter}
        feed={feed}
        limit={limit}
        filterId={filterId}
        loading={postsLoading}
        goToPost={goToPost}
        goToUser={goToUser}

        /*refresh={this.loadPosts.bind(this)}
        more={more}
        loadMore={this.loadMore.bind(this)}£/
        /*
        refresh={refreshFunction} // function to refresh the current posts
        loadMore={loadMoreFunction} // function to load more posts (pagination) when scroll reaches bottom
        hasMore={hasMoreBool} // boolean indicating if there are more posts to load (for pagination). Will call loadMoreFunction if this is true and scroll reaches bottom
        */
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  filterId: selectors.getFilterId(state),
  feed: selectors.getFeed(state),
  posts: actions.getPosts(state),
  blocks: profileActions.getBlocks(state),
  postsLoading: actions.getLoading(state),
  currentUser: state.currentUser
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadBlocks:() => dispatch(profileActions.loadBlocks()),
  toggleFilter: () => dispatch(actions.toggleFilter()),
  openCreatePost: () => dispatch(actions.goToCreatePost(ownProps.navigator)),
  loadPosts:(feed, filterId) => dispatch(actions.loadPosts(feed, filterId)),
  updateToken: (userId, token) => dispatch(actions.updateToken(userId, token)),
  goToPost: (post) => dispatch(actions.goToPost(post, ownProps.navigator)),
  goToUser: (user) => dispatch(actions.goToUser(user, ownProps.navigator)),
  stopRetrievingData: () => dispatch(actions.stopRetrievingData())
  
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenWrapper);
