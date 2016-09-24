/**
 * Created by hammadjutt on 2016-04-03.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import invariant from 'invariant';
import * as app from './app';
import { store } from './store';
import registerScreens from './registerScreens';
import screens from './screens';
import { Colors } from './UI';
import icons, { iconsLoaded } from './img/appIcons';


registerScreens(store, Provider);

// notice that this is just a simple class, it's not a React component
export default class App {
  constructor() {
    // since react-redux only works on components, we need to subscribe this class manually
    iconsLoaded.then(() => {});
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(app.actions.initApp());
  }
  onStoreUpdate() {
    const root = app.selectors.getAppRoot(store.getState());
    // handle a root change
    // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
    if (this.currentRoot !== root) {
      this.currentRoot = root;
      this.startApp(root);
    }
  }
  tabStyle = {
    tabBarButtonColor: '#A4BCC6',
    tabBarBackgroundColor: '#001C2B',
    tabBarSelectedButtonColor: Colors.primary
  };
  navStyle = {
    navBarTextColor: Colors.primary,
    navBarBackgroundColor: Colors.secondaryDark,
    navBarButtonColor: Colors.white,
    statusBarTextColorScheme: 'light',
    navBarNoBorder: true,
    drawUnderTabBar: false,
    navBarTranslucent: false,
    drawUnderNavBar: false
  };
  startApp(root) {
    switch (root) {
      case app.constants.ONBOARDING_ROOT:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.onboarding,
            navigatorStyle: {
              ...this.navStyle,
              navBarHidden: true
            }
          },
          animationType: 'fade'
        });
        return;
      case app.constants.LOGIN_ROOT:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.login,
            navigatorStyle: {
              ...this.navStyle,
              navBarHidden: true
            }
          },
          animationType: 'fade'
        });
        return;
      case app.constants.MAIN_ROOT:
        Navigation.startTabBasedApp({
          tabs: [
            {
              screen: screens.notifications,
              icon: require('./img/icons/notifications.png'),
              selectedIcon: require('./img/icons/notifications.png'),
              title: 'Notifications',
              navigatorStyle: this.navStyle
            },
            {
              screen: screens.home,
              icon: require('./img/icons/home.png'),
              selectedIcon: require('./img/icons/home.png'),
              title: 'Home',
              navigatorStyle: {
                ...this.navStyle,
                navBarHidden: true
              }
            },
            {
              screen: screens.messages,
              icon: require('./img/icons/messages.png'),
              selectedIcon: require('./img/icons/messages.png'),
              title: 'Messages',
              navigatorStyle: {
                ...this.navStyle,
                navBarHidden: true,
                statusBarBlur: true
              }
            }
          ],
          drawer: {
            left: {
              screen: screens.sideMenu
            },
            type: 'MMDrawer',
            animationType: 'parallax',
            disableOpenGesture: true,
            navigatorStyle: this.navStyle
          },
          tabsStyle: this.tabStyle,
          animationType: 'fade'
        });
        return;
      default:
        invariant(null, 'Invalid app root: %s', root);
    }
  }
}
