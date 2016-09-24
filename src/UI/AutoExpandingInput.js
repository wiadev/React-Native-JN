import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default class AutoExpandingTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '', height: 0 };
  }
  render() {
    return (
      <TextInput
        {...this.props}
        multiline
        onChange={(event) => {
          this.setState({
            text: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height,
          });
        }}
        style={[styles.input, { height: Math.max(35, this.state.height) }]}
        value={this.state.text}
      />
    );
  }
}


const styles = StyleSheet.create({
  input: {
    height: 26,
    flex: 1,
    fontSize: 13,
    padding: 4,
  }
});
