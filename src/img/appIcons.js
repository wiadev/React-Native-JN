import Ionicons from 'react-native-vector-icons/Ionicons';

const icons = {
  notifications: ['md-notifications', 30, '#000'],
  messages: ['ios-chatbubbles', 30, '#000'],
  home: ['ios-home', 30, '#000'],
  menu: ['ios-arrow-forward', 28, '#000'],
  close: ['md-close', 28, '#000'],
  share: ['ios-share-outline', 28, '#000'],
  like: ['md-heart-outline', 28, '#000'],
  liked: ['md-heart', 28, '#FE3824'],
  post: ['md-add', 28, '#000']
};

const iconsLoaded = new Promise(resolve => {
  Promise.all(
    Object.keys(icons).map(iconName =>
      Ionicons.getImageSource(
        icons[iconName][0],
        icons[iconName][1],
        icons[iconName][2]
      ))
  ).then(sources => {
    Object.keys(icons)
    .forEach((iconName, idx) => {
      icons[iconName] = sources[idx];
    });
    resolve(true);
  });
});

export {
  icons as default,
  iconsLoaded
};


// Usage example
// import { icons, iconsLoaded } from 'myproject/app-icons';
// iconsLoaded.then(() => {
//   icons['ios-person--active'] // The source is loaded
// });
