import React, { Component } from 'react';
import { ListView, View, TouchableHighlight, StyleSheet } from 'react-native';
import { Base, TextBase } from 'panza';
import CircleImage from './CircleImage';
import Colors from './Colors';

class ChatList extends Component {
  static propTypes = {
    chats: React.PropTypes.arrayOf(React.PropTypes.object),
    goToChat: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (oldRow, newRow) => oldRow !== newRow
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(props.chats)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chats !== this.props.chats) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.chats)
      });
    }
  }

  renderRow(chat) {
    return (
      chat.user
        ?
        <TouchableHighlight underlayColor={Colors.underlay} onPress={() => this.props.goToChat(chat)}>
        <View style={styles.container}>
          <CircleImage size={70} source={{ uri: chat.user.avatar }} />
          <Base flex={1} justify="center" ml={1}>
            <TextBase fontSize={4} bold color={Colors.white}>
              {chat.user.name}
            </TextBase>
            {chat.lastMessage ?
              <TextBase style={{ marginTop: 3 }} fontSize={5} color={`${Colors.white}88`}>
                {chat.lastMessage}
              </TextBase>
              :
              null
            }
          </Base>
          {chat.unread ? <View style={styles.dot} /> : null}
        </View>
      </TouchableHighlight>
      :
      null
      
      
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.clear,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: 6
  }
});

export default ChatList;
