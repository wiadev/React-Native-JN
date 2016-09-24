import React from 'react';
import Composer from './Composer';
import Comment from './Comment';

export default class CommentList extends React.Component {
  static propTypes = {
    goToUser: React.PropTypes.func.isRequired,
    post: React.PropTypes.object,
    comments: React.PropTypes.arrayOf(React.PropTypes.object),
    isLoadingMore: React.PropTypes.bool,
    shouldLoadMore: React.PropTypes.bool,
    loadMore: React.PropTypes.func,
    postComment: React.PropTypes.func,
    showCommentOptions: React.PropTypes.func,
    renderHeader: React.PropTypes.func,
    isHomeFeed: React.PropTypes.bool
  };
  static defaultProps = {
    comments: []
  };

  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  onSend(props) {
    const data = props[0];
    this.props.postComment(data);
  }

  renderMessage(props) {
    const isOP = this.props.post.user._id === props.currentMessage.user._id;
    return (
      <Comment
        comment={props.currentMessage}
        goToUser={this.props.goToUser}
        showOptions={this.props.showCommentOptions}
        isHomeFeed={props.isHomeFeed}
        isOP={isOP}
      />
    );
  }

  render() {
    const { comments, shouldLoadMore, isLoadingMore, loadMore, isHomeFeed, renderHeader, ...props } = this.props;
    return (
      <Composer
        messages={comments}
        onSend={this.onSend}
        loadEarlier={shouldLoadMore}
        isHomeFeed={isHomeFeed}
        onLoadEarlier={loadMore}
        isLoadingEarlier={isLoadingMore}
        renderMessage={this.renderMessage}
        invertibleScrollViewProps={{
          inverted: false
        }}
        renderFooter={renderHeader}
        {...props}
      />
    );
  }
}
