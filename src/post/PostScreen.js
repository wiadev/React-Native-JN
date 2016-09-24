import _ from 'lodash';
import React from 'react';
import { RefreshControl, StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { Base, TextBase, Icon, LoadingPage } from 'panza';
import icons from '../img/appIcons';
import * as upload from '../lib/upload';
import * as actions from './actions';
import * as profileActions from './../profile/actions';
import { actions as homeActions } from '../home';
import { Colors, VoteButtons, CommentList } from '../UI';
import { timeSince } from '../utils';
import { rebase } from '../app/actions'



class PostScreen extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    post: React.PropTypes.object,
    sharePost: React.PropTypes.func,
    showCommentOptions: React.PropTypes.func,
    isHomeFeed: React.PropTypes.bool
  };
  static defaultProps = {
    refresh: () => new Promise(resolve => resolve())
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    
    this.postComment = this.postComment.bind(this);
    this.renderPost = this.renderPost.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      refreshing: false
    };

  }

  componentDidMount() {
    

    this.props.loadPost();
    this.props.loadComments();

    this.props.navigator.setButtons({
      rightButtons: [{
        icon: icons.share,
        id: 'share',
      }],
      leftButtons: [{
        icon: icons.close,
        id: 'close'
      }]
    });
  }

  componentWillUnmount() {
    this.props.stopLoad();
  }


  onRefresh() {
    this.setState({ refreshing: true });
    this.props.refresh().then(() => {
      this.setState({ refreshing: false });
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'share') {
        this.props.sharePost(this.props.post);
      }
      if (event.id === 'close') {
        this.props.navigator.dismissModal();
      }
    }
  }
  
  postComment(data){
    console.log(this.props.currentUser._id , 'currentUser')
    if(this.props.blocks.indexOf(this.props.currentUser._id) === -1)
      this.props.postComment(data);
  }

  renderPost() {
    const { feeds, feedsName, currentUser, isHomeFeed,  post ,post: { text, postTime, feed, _id , likes, unlikes, image }} = this.props;
    
    return (
      <Base
        backgroundColor={Colors.white}
        shadowOpacity={0.3}
        shadowRadius={4}
        shadowOffset={{ width: 0, height: 0 }}
        zIndex={1}
      >
        <TextBase fontSize={5} px={2} mt={2}>
          {text}
        </TextBase>
        { image ?
          <Image source={{ uri: image }} style={{ height: 250, marginTop: 16, flex: 1, backgroundColor: Colors.background }} />
          : null
        }
        <Base row py={2} px={2} align={'center'}>
          <TextBase color={Colors.primary}>
            {timeSince(postTime)}
          </TextBase>
          <Icon ml={3} name={'ios-school-outline'} color={Colors.primary} size={17} />
          <TextBase color={Colors.primary}>
            {feedsName[feed] ? ` ${feedsName[feed].label}`: ''}
          </TextBase>
          <VoteButtons isHomeFeed={isHomeFeed} post={post} likes={likes} unlikes={unlikes} flex={1} justify={'flex-end'} />
        </Base>
      </Base>
    );
  }

  render() {

    const { post , comments, loading ,isHomeFeed, currentUser, blocks, ...props } = this.props;
    let commentsFilter = comments;
    let isBlocked = false;

    if(blocks && blocks.length){
      commentsFilter = _.filter(comments, (obj) =>  blocks.indexOf(obj.user._id) === -1)
      
      if(post && post.user)
        isBlocked = blocks.indexOf(post.user._id) != -1
    }
    
    return (
      <View style={styles.container}>
        {
          !post && isBlocked ?
            null
          :
          (loading ?
            <LoadingPage />
            :
            <CommentList
              comments={commentsFilter}
              post={post}
              isHomeFeed={isHomeFeed}
              postComment={this.postComment.bind(this)}
              renderHeader={this.renderPost.bind(this)}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                  tintColor={Colors.lightGrey}
                />
              }
              {...props}
            />
          )
        }
        
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background }
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    feeds: state.feeds,
    feedsName: state.feedsName,
    post: actions.getPost(state),
    comments: actions.getComments(state),
    isHomeFeed: actions.isHomeFeed(state),
    blocks: profileActions.getBlocks(state),
    loading: actions.getLoading(state),
  };
}


export default connect(mapStateToProps,
  (dispatch, ownProps) => ({
    sharePost: (post) => dispatch(homeActions.onPostOptionsPress(post)),
    showCommentOptions: (comment) => dispatch(homeActions.onCommentOptionsPress(comment)),
    goToUser: (user) => dispatch(homeActions.goToUser(user, ownProps.navigator)),
    loadPost: () => dispatch(actions.loadPost(ownProps.post)),
    loadComments: () => dispatch(actions.loadComments(ownProps.post)),
    postComment:(data) => dispatch(actions.postComment(data, ownProps.post)),
    stopLoad: () => dispatch(actions.stopLoad(ownProps.post))
  })
)(PostScreen);
