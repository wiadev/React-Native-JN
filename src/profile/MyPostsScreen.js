import _ from 'lodash';
import React from 'react';
import * as firebase from 'firebase';
import { RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Base,
  LoadingPage
} from 'panza';
import mockData from '../mockData';
import { Colors, PostList } from '../UI';
import { rebase } from '../app/actions';
import icons from '../img/appIcons';
import { connect } from 'react-redux';

class MyPosts extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    sharePost: React.PropTypes.func,
    posts: React.PropTypes.array,
    loading: React.PropTypes.bool,
    hasMore: React.PropTypes.bool,
    loadMore: React.PropTypes.func,
    refresh: React.PropTypes.func
  };

  static defaultProps = {
    posts: mockData.postIds.map(id => mockData.posts[id]),
    refresh: () => new Promise(resolve => resolve())
  };

  constructor(props) {
    super(props);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      refreshing: false
    };
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

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.refresh().then(() => {
      this.setState({ refreshing: false });
    });
  }

  onEndReached() {
    if (!this.props.loading && this.props.hasMore) {
      this.props.loadMore();
    }
  }

  render() {
    const { navigator, posts, loading, hasMore } = this.props;
    const hasPosts = posts.length > 0;

    return (
      <Base flex={1} backgroundColor={Colors.background}>
        {!hasPosts ? (
          loading ?
            <LoadingPage style={styles.absolute} />
            :
            <LoadingPage
              loadingText="No Posts"
              isLoading={false}
              style={styles.absolute}
            />
        )
          :
          null
        }

        <PostList
          style={{ flex: 1, backgroundColor: Colors.background }}
          navigator={navigator}
          posts={posts}
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              tintColor={Colors.lightGrey}
            />
          }
          renderFooter={hasMore && hasPosts ?
            () => <Base py={2} align={'center'}>
              <ActivityIndicator color={Colors.lightGrey} size={'large'} animating />
            </Base>
            :
            () => <Base py={2} />
          }
        />
      </Base>
    );
  }
}

const styles = StyleSheet.create({
  absolute: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
});

class MyPostsWrapper extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    type: React.PropTypes.oneOf(['posts', 'comments']),
    sharePost: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      posts: mockData.postIds.map(id => mockData.posts[id])
    };
  }


  componentDidMount() {
    const userId = this.props.currentUser._id;
    console.log('userId', userId)

    // get current users posts or comments depending on this.props.type
    firebase.database().ref(`/allPosts`).orderByChild("user/_id").equalTo(userId).on("value", (snapshot) => {
      this.setState({posts: _.map(snapshot.val(), (obj) => {return obj})})
    })
  }

  render() {
    const postsReversed = this.state.posts;
    _.reverse(postsReversed);

    return (
      <MyPosts
        posts={postsReversed}
        /*
        TODO: pass in the following props to MyPosts:

        refresh={refreshFunction} // function to refresh the current posts
        loading={loadingBool} // boolean indicating if posts are loading
        loadMore={loadMoreFunction} // function to load more posts (pagination) when scroll reaches bottom
        hasMore={hasMoreBool} // boolean indicating if there are more posts to load (for pagination). Will call loadMoreFunction if this is true and scroll reaches bottom
        sharePost={sharePostFunction} // function to handle when user presses share icon
        */
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}


export default connect(mapStateToProps,
  (dispatch, ownProps) => ({
    sharePost: () => dispatch(homeActions.sharePost(ownProps.post)),
  })
)(MyPostsWrapper);
