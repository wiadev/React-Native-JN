import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Text } from 'react-native';
import {
  Base,
  TextBase,
  Icon,
  TouchableIcon
} from 'panza';
import { Colors } from '../UI';
import { actions as homeActions } from '../home';

const VoteButtons = ({ user, likes, unlikes, onupLike, onupUnlike, didupLike, didupUnlike, isHomeFeed, ...props }) => (
  <Base row justify="space-between" align="center" {...props}>
    {
      isHomeFeed ?
      <TouchableOpacity onPress={onupLike} accessibilityLabel="Up-Vote" activeOpacity={0.6}>
        <Text style={{ fontSize: 22, height: 26, opacity: likes && (user._id in likes) ? 1 : 0.3 }}>{String.fromCharCode(0xD83D, 0xDE0D)}</Text>
      </TouchableOpacity>
      :
      null
    }
    
    <Base mx={2}>
      <TextBase fontSize={4} color={Colors.primary}>
        {(likes ? Object.keys(likes).length : 0) - (unlikes ? Object.keys(unlikes).length : 0)}
      </TextBase>
    </Base>
    {
      isHomeFeed ?
      <TouchableOpacity onPress={onupUnlike} accessibilityLabel="Down-Vote" activeOpacity={0.6}>
        <Text style={{ fontSize: 22, height: 26, opacity: unlikes && (user._id in unlikes) ? 1 : 0.3 }}>{String.fromCharCode(0xD83D, 0xDCA9)}</Text>
      </TouchableOpacity>
      :
      null
    }
  </Base>
);

VoteButtons.propTypes = {
  post: React.PropTypes.object,
  comment: React.PropTypes.object,
  likes: React.PropTypes.object,
  unlikes: React.PropTypes.object,
  onupLike: React.PropTypes.func,
  onupUnlike: React.PropTypes.func,
  didupLike: React.PropTypes.bool,
  didupUnlike: React.PropTypes.bool,
  isHomeFeed: React.PropTypes.bool
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onupLike: () => dispatch(homeActions.upLike(ownProps.post, ownProps.comment)),
  onupUnlike: () => dispatch(homeActions.upUnlike(ownProps.post, ownProps.comment)),
});

export default connect((state, ownProps) => ({
    user: state.currentUser
  }), mapDispatchToProps)(VoteButtons);

