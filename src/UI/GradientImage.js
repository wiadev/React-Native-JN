import React, { Component } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Colors from './Colors';
import LinearGradient from 'react-native-linear-gradient';

export default class GradientImage extends Component {
  static propTypes = {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    blurRadius: React.PropTypes.number,
    image: React.PropTypes.string,
    gradient: React.PropTypes.array,
    children: React.PropTypes.node
  };
  static defaultProps= {
    blurRadius: 5,
    image: 'https://i.imgur.com/eYfGJkf.jpg',
    gradient: Colors.whiteGradient
  };
  render() {
    const { image, height, width, gradient, blurRadius, children } = this.props;
    return (
      <View style={[styles.fitted, { height, width }]}>
        <Image
          style={{ flex: 1 }}
          resizeMode="cover"
          source={{ uri: image }}
          blurRadius={blurRadius}
        />
        <LinearGradient
          colors={gradient}
          style={[styles.fitted, { position: 'absolute' }]}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fitted: { flex: 1, right: 0, left: 0, top: 0, bottom: 0 }
});
