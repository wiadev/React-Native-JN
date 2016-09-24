import React from 'react';
import { Image, Dimensions } from 'react-native';

export default class BackgroundImage extends React.Component {
  static propTypes = {
    style: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    const dims = Dimensions.get('window');
    this.width = dims.width;
    this.height = dims.height;
  }

  render() {
    const { style, ...props } = this.props;
    return (
      <Image
        style={[{ width: this.width, height: this.height, flex: 1, backgroundColor: 'transparent' }, style]}
        {...props}
      />
    );
  }
}
