import _ from 'lodash';
import React from 'react';
import * as firebase from 'firebase';
import { RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Base,
  LoadingPage
} from 'panza';
import mockData from '../mockData';
import { Colors, CommentList } from '../UI';
import { rebase } from '../app/actions';
import icons from '../img/appIcons';
import { connect } from 'react-redux';

class MyComments extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    posts: React.PropTypes.array,
    loading: React.PropTypes.bool,
    hasMore: React.PropTypes.bool,
    loadMore: React.PropTypes.func,
    refresh: React.PropTypes.func
  };

  static defaultProps = {
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
    const { navigator, comments, loading, hasMore } = this.props;
    const hasComments = comments.length > 0;

    return (
      <Base flex={1} backgroundColor={Colors.background}>
        {!hasComments ? (
          loading ?
            <LoadingPage style={styles.absolute} />
            :
            <LoadingPage
              loadingText="No Comments"
              isLoading={false}
              style={styles.absolute}
            />
        )
          :
          null
        }

        <CommentList
          style={{ flex: 1, backgroundColor: Colors.background }}
          navigator={navigator}
          comments={comments}
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              tintColor={Colors.lightGrey}
            />
          }
          renderFooter={hasMore && hasComments ?
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

class MyCommentsWrapper extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
  }


  componentDidMount() {
    const userId = this.props.currentUser._id;
    var ref = firebase.database().ref(`/allPosts`);
    ref.on("value", (snapshot) => {

      this.setState({comments: _.map(snapshot.val(), (obj) => {return obj})})

    })
  }

  render() {
    const commentsReversed = this.state.comments;
    _.reverse(commentsReversed);

    return (
      <MyComments
        comments={commentsReversed}
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


export default connect(mapStateToProps,null)(MyCommentsWrapper);
