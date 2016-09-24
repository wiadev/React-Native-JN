import { Navigation } from 'react-native-navigation';
import * as app from './app';
import * as messages from './messages';
import * as notifications from './notifications';
import * as post from './post';
import * as profile from './profile';
import * as settings from './settings';
import * as home from './home';
import OnboardingScreen from './UI/OnboardingScreen';
import LightBox from './UI/LightBox';
import screens from './screens';

const registerScreens = (store, Provider) => {
  Navigation.registerComponent(screens.login, () => app.LoginScreen, store, Provider);
  Navigation.registerComponent(screens.onboarding, () => OnboardingScreen, store, Provider);
  Navigation.registerComponent(screens.lightBox, () => LightBox, store, Provider);
  Navigation.registerComponent(screens.messages, () => messages.screen, store, Provider);
  Navigation.registerComponent(screens.chat, () => messages.ChatScreen, store, Provider);
  Navigation.registerComponent(screens.notifications, () => notifications.screen, store, Provider);
  Navigation.registerComponent(screens.post, () => post.screen, store, Provider);
  Navigation.registerComponent(screens.createPost, () => home.screens.CreatePost, store, Provider);
  Navigation.registerComponent(screens.profile, () => profile.screen, store, Provider);
  Navigation.registerComponent(screens.myPosts, () => profile.MyPostsScreen, store, Provider);
  Navigation.registerComponent(screens.myComments, () => profile.MyCommentsScreen, store, Provider);
  Navigation.registerComponent(screens.settings, () => settings.screen, store, Provider);
  Navigation.registerComponent(screens.home, () => home.screen, store, Provider);
  Navigation.registerComponent(screens.sideMenu, () => home.screens.SideMenu, store, Provider);
};

export default registerScreens;
