import React, { Component } from 'react';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { Modal } from 'react-native-controllers';
import screens from '../screens';

export default class OpenableImage extends Component {
  static propTypes = {
    source: Image.propTypes.source,
    style: Image.propTypes.style
  };
  constructor(props) {
    super(props);
    this.openImage = this.openImage.bind(this);
  }
  openImage() {
    Modal.showLightBox({
      component: screens.lightBox,
      passProps: { source: this.props.source },
      style: {
        backgroundBlur: 'dark'
      }
    });
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.openImage}>
        <Image {...this.props} />
      </TouchableWithoutFeedback>
    );
  }
}
