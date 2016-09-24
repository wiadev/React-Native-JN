import React from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TextBase, Base } from 'panza';
import Colors from './Colors';

class ProfileStat extends React.Component {
  render() {
    const { value, label, icon, placeholder, editable, onChangeText, onPress, ...props } = this.props;
    return (
      <Base align="center" {...props}>
        {onChangeText ?
          <TextInput
            defaultValue={value}
            style={{
              fontSize: 15,
              height: 15,
              color: Colors.grey,
              textAlign: 'center',
              marginBottom: 8
            }}
            placeholder={placeholder}
            autoCapitalize={'none'}
            editable={editable}
            onChangeText={onChangeText}
          />
          : null
        }
        <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.5 : 1}>
          <View style={styles.circle}>
            {label ?
              <TextBase fontSize={6} color={Colors.grey}>
                {label}
              </TextBase>
              : null
            }
            {!editable && value && !icon ?
              <TextBase fontSize={5} bold color={Colors.secondaryLight}>
                {value}
              </TextBase>
              : null
            }
            {icon ?
              <Image source={icon} />
              : null
            }
          </View>
        </TouchableOpacity>
      </Base>
    );
  }
}

ProfileStat.propTypes = {
  value: React.PropTypes.string,
  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  editable: React.PropTypes.bool,
  icon: React.PropTypes.object,
  onChangeText: React.PropTypes.func,
  onPress: React.PropTypes.func,
};

ProfileStat.defaultProps = {
  editable: false
};

const styles = StyleSheet.create({
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProfileStat;
