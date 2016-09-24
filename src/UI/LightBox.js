import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image, Dimensions } from 'react-native';
import { Modal } from 'react-native-controllers';

export default class LightBox extends Component {
  static propTypes = {
    image: React.PropTypes.string
  };
  constructor(props) {
    super(props);
    const dim = Dimensions.get('window');
    this.width = dim.width;
    this.height = dim.height;
  }
  render() {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={Modal.dismissLightBox}>
        <Image
          source={this.props.source}
          style={{ flex: 1, width: this.width, height: this.height, resizeMode: 'contain' }}
        />
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
});
