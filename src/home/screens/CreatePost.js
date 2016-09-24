import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Base, TextBase } from 'panza';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import icons from '../../img/appIcons';
import { Colors, ImageSelectAction, PostImage } from '../../UI';
import * as firebase from 'firebase';
import upload from '../../lib/upload';

class CreatePost extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    createPost: React.PropTypes.func,
    maxLength: React.PropTypes.number,
    feedName: React.PropTypes.string
  };
  static defaultProps = {
    maxLength: 4096,
    createPost: () => new Promise(resolve => resolve()),
    feedName: '<feed-name>'
  };

  constructor(props) {
    super(props);
    this.onPost = this.onPost.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = { text: '', height: 0, image: null, imageBase64: null, postDisabled: true };
  }

  componentDidMount() {
    this.props.navigator.setButtons({
      leftButtons: [{
        icon: icons.close,
        id: 'close'
      }],
      rightButtons: [{
        title: 'Post',
        id: 'post',
        disabled: true
      }]
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.postDisabled !== this.state.postDisabled) {
      this.props.navigator.setButtons({
        rightButtons: [{
          title: 'Post',
          id: 'post',
          disabled: this.state.postDisabled
        }]
      });
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal();
      } else if (event.id === 'post') {
        this.onPost();
      }
    }
  }

  onChange(event) {
    const text = event.nativeEvent.text;
    this.setState({
      text,
      height: event.nativeEvent.contentSize.height,
      postDisabled: text.length < 1 && !this.state.image
    });
  }

  onImageSelect(image, imageBase64) {
    this.setState({
      image,
      postDisabled: !image,
      imageBase64
    });
  }

  onPost() {


    const { _id, avatar, name, universityFeed } = this.props.currentUser

    // Get a unique key for a new Post
    let newPostKey = firebase.database().ref().child('posts').push().key;
    
    // post entry data
    const postData = {
      _id: newPostKey,
      user:{
        avatar: avatar,
        name: name,
        _id: _id
      },
      feed: universityFeed,
      postTime: Date.now(),
      likes: {},
      unlikes: {},
      text: this.state.text,
      comments: 0,
      counter: 0
    };

    let updates = {};
    //updates[`/users/${_id}/posts/${newPostKey}`] = postData;
    updates[`/allPosts/${newPostKey}`] = postData;

    firebase.database().ref().update(updates).then(() => this.props.navigator.dismissModal())
    
    if(this.state.image){
      upload.uploadImage(this.state.image, 
        newPostKey, 
        'posts', 
        postData,
        `/allPosts/${newPostKey}`
      );
    }

    return true;

  }

  render() {
    const { maxLength, feedsName,  currentUser: { universityFeed } } = this.props;

    const feed = feedsName[universityFeed] ? feedsName[universityFeed].name : ''

    const charsLeft = maxLength - this.state.text.length;
    return (
      <Base flex={1}>
        <TextBase
          Component={TextInput}
          color={Colors.darkGrey}
          selectionColor={Colors.primary}
          fontSize={4}
          enablesReturnKeyAutomatically
          multiline
          autoFocus
          onChange={this.onChange}
          style={[styles.input, { height: Math.max(80, this.state.height) }]}
          value={this.state.text}
          placeholder={'What\'s on your mind?'}
          placeholderTextColor={Colors.grey}
          maxLength={maxLength}
        />
        <Base>
          <Base row justify={'space-between'} align={'flex-end'} px={2} py={1}>
            {
              this.state.image ?
                <PostImage
                  source={{ isStatic: true, uri: this.state.image.replace('file://', '') }}
                  style={{ flex: 0, height: 60, width: 60, marginTop: 0 }}
                />
                :
                <View />
            }
            <ImageSelectAction onSelect={this.onImageSelect} />
          </Base>
          <Base row justify={'space-between'} px={2} py={1} style={styles.borderTop}>
            <TextBase color={Colors.grey} fontSize={5}>
              Anonymous Post to {feed}
            </TextBase>
            <TextBase color={Colors.secondary} fontSize={4}>
              {charsLeft}
            </TextBase>
          </Base>
        </Base>

        <KeyboardSpacer />
      </Base>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    feed: state.feed,
    feedsName: state.feedsName,
  };
}

export default connect(mapStateToProps)(CreatePost);

const styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGrey
  },
  input: {
    flex: 1,
    margin: 8,
    padding: 4
  }
});
