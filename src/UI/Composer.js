import React from 'react';
import { View } from 'react-native';
import { TouchableIcon, Icon } from 'panza';
import { GiftedChat } from 'react-native-gifted-chat';
import { Base } from 'panza';
import ImageSelectAction from './ImageSelectAction';
import Colors from './Colors';
import mockData from '../mockData';
import PostImage from './PostImage';

export default class Composer extends React.Component {
  static propTypes = GiftedChat.propTypes;
  static defaultProps = {
    onSend: () => {},
    user: mockData.currentUser,
    isHomeFeed: false
  };
  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderImagePreview = this.renderImagePreview.bind(this);
    this.state = {
      image: null
    };
  }

  onImageSelect(image) {
    this.setState({ image });
  }

  onSend(props) {
    const data = props[0];
    if (this.state.image) {
      data.image = this.state.image;
    }
    this.props.onSend([data]);
    this.setState({ image: null });
  }

  renderImagePreview() {
    return (
      <Base pr={2} pl={4}>
        <PostImage
          source={{ isStatic: true, uri: this.state.image.replace('file://', '') }}
          style={{ height: 100, marginTop: 0 }}
        />
      </Base>
    );
  }
  renderCustomActions(props) {
    return (
      <ImageSelectAction
        {...props}
        onSelect={this.onImageSelect}
        size={26}
        style={{
          width: 26,
          height: 26,
          marginLeft: 10,
          marginBottom: 10,
        }}
      />
    );
  }
  renderSend(props) {
    if (props.text.trim().length > 0 || this.state.image) {
      return (
        <TouchableIcon
          accessibilityLabel={'Send'}
          onPress={() => {
            props.onSend({ text: props.text.trim() }, true);
          }}
          style={{
            paddingHorizontal: 8
          }}
        >
          <Icon
            name={'ios-send'}
            color={Colors.primary}
          />
        </TouchableIcon>
      );
    }
    return null;
  }


  render() {
    return (
      <GiftedChat
        {...this.props}
        onSend={this.onSend}
        renderActions={this.renderCustomActions}
        renderSend={this.renderSend}
        renderAccessory={this.state.image ? this.renderImagePreview : null}
        accessoryStyle={{ height: 120 }}
        accessoryHeight={120}
      />
    );
  }
}
