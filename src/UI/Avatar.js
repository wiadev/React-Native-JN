import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Base, TextBase } from 'panza';
import CircleImage from './CircleImage';
import Colors from './Colors';


const Avatar = ({
  picture,
  title,
  subtitle,
  size,
  titleProps,
  onPress,
  border
}) =>
  <TouchableOpacity activeOpacity={onPress ? 0.5 : 1} onPress={onPress}>
    <Base align="center" px={1} style={{ maxWidth: size * 2 }}>
      <CircleImage
        size={size}
        resizeMode={'cover'}
        source={{ uri: picture }}
        style={[
          border && {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: Colors.lightGrey
          },
          { backgroundColor: Colors.background }
        ]}
      />
      {title ? <TextBase bold mt={1} fontSize={6} color={Colors.secondary} numberOfLines={1} {...titleProps}>{title}</TextBase> : null}
      {subtitle ? <TextBase color={Colors.secondaryLight} numberOfLines={1} fontSize={6}>{subtitle}</TextBase> : null}
    </Base>
  </TouchableOpacity>
;

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  picture: React.PropTypes.string,
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  size: React.PropTypes.number,
  titleProps: React.PropTypes.object,
  onPress: React.PropTypes.func,
  border: React.PropTypes.bool
};

Avatar.defaultProps = {
  size: 90,
  border: true
};

export default Avatar;
