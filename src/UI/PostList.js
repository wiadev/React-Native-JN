import React, { Component } from 'react';
import { ListView } from 'react-native';

import PostCard from './PostCard';

class PostList extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    posts: React.PropTypes.arrayOf(React.PropTypes.object)
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (oldRow, newRow) => oldRow !== newRow
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(props.posts)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts !== this.props.posts) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.posts)
      });
    }
  }

  renderRow(post) {
    return (
      <PostCard post={post} navigator={this.props.navigator} />
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        initialListSize={5}
        enableEmptySections
        removeClippedSubviews
        {...this.props}
      />
    );
  }
}

export default PostList;
