import React from 'react'
import {
  Base,
  TextBase,
  Icon,
  TouchableIcon
} from 'panza';
import { Modal } from 'react-native-controllers';
import { View, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import Colors from './Colors';
import IconButton from './IconButton';
import OpenableImage from './OpenableImage';
import VoteButtons from './VoteButtons';
import { timeSince } from '../utils';
import { actions as homeActions } from '../home';

const PostCard = ({ post: { _id, postTime, text, comments , likes, unlikes, image  }, post , onPostOptionsPress, goToPost, currentUser }) => {
  const len = comments;

  const commentString = len ? `${len} comment${len > 1 ? 's' : ''}` : 'Write a comment';
  const isHomeFeed = currentUser.universityFeed === post.feed;
  return (
    <View style={styles.container}>
      <Base row justify="space-between" align="center" px={2} py={1}>
        <TextBase color={Colors.grey}>
          {timeSince(postTime)}
        </TextBase>
        <TouchableIcon onPress={onPostOptionsPress} accessibilityLabel="Share">
          <Icon name={'ios-share-outline'} color={Colors.grey} size={24} />
        </TouchableIcon>
      </Base>
      {text && text.length ?
        <TextBase fontSize={5} numberOfLines={6} px={2} pb={1}>
          {text}
        </TextBase>
        : null
      }
      { image ?
        <OpenableImage source={{ uri: image }} style={{ height: 225, marginTop: 8, backgroundColor: Colors.background, resizeMode: 'cover' }} />
        : null
      }

      <Base row justify="space-between" px={2} py={1}>
        <IconButton
          onPress={goToPost}
          icon={'ios-chatbubbles-outline'}
          color={Colors.primary}
          label={commentString}
          iconSize={20}
          p={0}
        />
        <VoteButtons isHomeFeed={isHomeFeed} post={post} likes={likes} unlikes={unlikes}  />
      </Base>
    </View>
  );
};

PostCard.propTypes = {
  post: React.PropTypes.shape({
    _id: React.PropTypes.string,
    postTime: React.PropTypes.number,
    text: React.PropTypes.string,
    comments: React.PropTypes.number,
    likes: React.PropTypes.object,
    unlikes: React.PropTypes.object,
    isHomeFeed: React.PropTypes.bool
  }).isRequired,
  navigator: React.PropTypes.object.isRequired,
  onPostOptionsPress: React.PropTypes.func,
  goToPost: React.PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${Colors.white}`,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }
  },
});

export default connect((state, ownProps) => ({
    currentUser: state.currentUser
  }),
  (dispatch, ownProps) => ({
    onPostOptionsPress: () => dispatch(homeActions.onPostOptionsPress(ownProps.post)),
    goToPost: () => dispatch(homeActions.goToPost(ownProps.post, ownProps.navigator))
  })
)(PostCard);
