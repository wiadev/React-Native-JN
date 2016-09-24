import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import OpenableImage from './OpenableImage';

export default class PostImage extends Component {
  static propTypes = {
    source: Image.propTypes.source.isRequired,
    style: Image.propTypes.style
  };

  render() {
    return (
      <OpenableImage
        {...this.props}
        style={[styles.image, this.props.style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 6,
    resizeMode: 'cover',
    marginTop: 16,
    height: 150
  }
});
