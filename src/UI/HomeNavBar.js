import React from 'react';

import {
  View,
  StyleSheet,
  Navigator,
  Image
} from 'react-native';

import { Base } from 'panza';

import Colors from './Colors';
import IconButton from './IconButton';


const HomeNavBar = ({ onMenuPress, onFilterPress, menuLabel, filter }) => {
  return (
    <View style={styles.navBar}>
      <Base flex={1} mt={3} row justify="space-between">
        <IconButton
          iconRight={'ios-arrow-forward'}
          py={0}
          iconSize={20}
          fontSize={4}
          color={Colors.white}
          label={menuLabel}
          onPress={onMenuPress}
          iconStyle={{ paddingTop: 3 }}
        />
        <Image source={require('../img/LogoHeader.png')} style={{ opacity: 0.7 }} />
        <IconButton
          iconRight={filter.icon}
          py={0}
          iconSize={24}
          fontSize={4}
          color={Colors.primary}
          label={filter.label}
          onPress={onFilterPress}
        />
      </Base>
    </View>
  );
};

HomeNavBar.displayName = 'HomeNavBar';

HomeNavBar.defaultProps = {
  menuLabel: 'U of A'
};

HomeNavBar.propTypes = {
  menuLabel: React.PropTypes.string,
  filter: React.PropTypes.object.isRequired,
  onMenuPress: React.PropTypes.func,
  onFilterPress: React.PropTypes.func,
};


export default HomeNavBar;

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: Colors.secondaryDark,
    height: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end'
  }
});
