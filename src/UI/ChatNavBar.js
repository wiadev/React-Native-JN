import React from 'react';

import {
  View,
  StyleSheet,
  Navigator,
  TouchableOpacity
} from 'react-native';

import { Base, TextBase } from 'panza';

import Colors from './Colors';
import CircleImage from './CircleImage';
import IconButton from './IconButton';


const ChatNavBar = ({ onClosePress, onUserPress, user }) => {
  return (
    <View style={styles.navBar}>
      <Base flex={1} mt={3} pb={1} row justify="space-between">
        <IconButton
          icon={'md-close'}
          iconSize={30}
          color={Colors.primary}
          onPress={onClosePress}
        />
        <TouchableOpacity onPress={onUserPress}>
          <Base row align={'center'} style={{ height: 24 }}>
            <CircleImage size={30} source={{ uri: user.avatar }} style={{ marginRight: 8 }} />
            <TextBase fontSize={4} bold color={Colors.secondary}>
              {user.name}
            </TextBase>
          </Base>
        </TouchableOpacity>
        <View style={{ width: 30 }} />
      </Base>
    </View>
  );
};

ChatNavBar.displayName = 'ChatNavBar';

ChatNavBar.defaultProps = {
  menuLabel: 'U of A'
};

ChatNavBar.propTypes = {
  user: React.PropTypes.object,
  onClosePress: React.PropTypes.func,
  onUserPress: React.PropTypes.func,
};


export default ChatNavBar;

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: Colors.white,
    height: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end'
  }
});
