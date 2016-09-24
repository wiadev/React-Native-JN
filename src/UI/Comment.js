import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { Base, TextBase } from 'panza';
import { Colors, VoteButtons, CircleImage } from '../UI';
import PostImage from './PostImage';
import { timeSince } from '../utils';

const Comment = ({
  comment: { _id, likes, unlikes, user, text, image, createdAt, isPosting },
  isHomeFeed,
  comment,
  post,
  goToUser,
  showOptions,
  isOP
}) =>
  <TouchableHighlight onLongPress={() => showOptions(comment)} underlayColor={'rgba(0,0,0,0.1)'}>
    <View style={[styles.container, { opacity: isPosting ? 0.4 : 1 }]}>
      <TouchableWithoutFeedback onPress={!isOP ? () => goToUser(user) : () => {}}>
        <CircleImage size={40} source={isOP ? require('../img/OP-Icon.png') : { uri: user.avatar }} />
      </TouchableWithoutFeedback>
      <Base flex={1} justify="center" ml={1}>
        <TouchableWithoutFeedback onPress={!isOP ? () => goToUser(user) : () => {}}>
          <TextBase fontSize={5} bold color={Colors.secondary}>
            {isOP ? 'Original Poster' : user.name}
          </TextBase>
        </TouchableWithoutFeedback>
        {text ?
          <TextBase style={{ marginTop: 3 }} fontSize={5} color={Colors.darkGrey}>
            {text}
          </TextBase>
          :
          null
        }
        {image ?
          <PostImage source={{ uri: image }} />
          :
          null
        }
        <Base row mt={2} align={'center'} justify={'space-between'}>
          <TextBase color={Colors.grey}>
            {timeSince(createdAt)}
          </TextBase>
          <VoteButtons isHomeFeed={isHomeFeed} comment={comment} likes={likes} unlikes={unlikes}  />
        </Base>
      </Base>
    </View>
  </TouchableHighlight>
;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE'
  }
});

Comment.displayName = 'Comment';

Comment.propTypes = {
  comment: React.PropTypes.shape({
    user: React.PropTypes.object.isRequired,
    text: React.PropTypes.string.isRequired,
    likes: React.PropTypes.object,
    unlikes: React.PropTypes.object,
    createdAt: React.PropTypes.number.isRequired,
    _id: React.PropTypes.string.isRequired
  }).isRequired,
  goToUser: React.PropTypes.func.isRequired,
  showOptions: React.PropTypes.func,
  isHomeFeed: React.PropTypes.bool,
  isOP: React.PropTypes.bool,
};

Comment.defaultProps = {
  showOptions: () => {}
};


export default Comment;
