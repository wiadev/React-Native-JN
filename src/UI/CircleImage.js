/**
 * Created by hammadjutt on 2016-06-22.
 */
import React from 'react';
import { Image } from 'react-native';

const CircleImage = ({ size, style, ...props }) =>
  <Image
    resizeMode={'cover'}
    style={[style, { width: size, height: size, borderRadius: size / 2 }]}
    {...props}
  />
;

CircleImage.displayName = 'CircleImage';

CircleImage.propTypes = {
  size: React.PropTypes.number
};

CircleImage.defaultProps = {
  size: 90
};

export default CircleImage;
