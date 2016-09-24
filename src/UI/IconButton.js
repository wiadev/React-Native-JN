/**
 * Created by hammadjutt on 2016-06-20.
 */
import React, { PropTypes } from 'react';
import { Button, TextBase, Icon } from 'panza';
import { StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import Colors from './Colors';

const IconButton = ({
  color,
  rounded,
  selected,
  icon,
  iconStyle,
  iconRight,
  label,
  iconSize,
  fontSize,
  borderWidth,
  ...props
}) => {
  const bgColor = selected ? color || Colors.lightGrey : 'transparent';
  const textColor = selected ? (color ? Colors.white : Colors.grey) : color || Colors.grey;
  const borderColor = selected ? 'transparent' : color || Colors.lightGrey;
  const Component = selected ? TouchableHighlight : TouchableOpacity;
  return (
    <Button
      py={1}
      backgroundColor={bgColor}
      style={{ borderWidth, borderColor, borderRadius: rounded ? 50 : 3 }}
      Component={Component}
      activeOpacity={0.4}
      {...props}
    >
      {icon ? <Icon name={icon} size={iconSize} color={textColor} style={[{ marginRight: label ? 6 : 0 }, iconStyle]} /> : null}
      {label ?
        <TextBase style={{ lineHeight: 0 }} fontSize={fontSize} color={textColor}>
          {label}
        </TextBase>
        :
        null
      }
      {iconRight ? <Icon name={iconRight} size={iconSize} color={textColor} style={[{ marginLeft: label ? 6 : 0 }, iconStyle]} /> : null}
    </Button>
  );
};

IconButton.displayName = 'IconButton';

IconButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
  iconSize: PropTypes.number,
  iconStyle: PropTypes.object,
  fontSize: PropTypes.number,
  borderWidth: PropTypes.number,
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  dark: PropTypes.bool,
  rounded: PropTypes.bool,
  selected: PropTypes.bool,
};

IconButton.defaultProps = {
  iconSize: 15,
  fontSize: 5,
  borderWidth: 0,
  rounded: true
};

export default IconButton;
