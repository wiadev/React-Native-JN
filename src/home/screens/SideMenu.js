import React, { Component } from 'react';
import {
  TouchableHighlight,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { Base, TextBase, Icon } from 'panza';
import * as actions from '../actions';
import { actions as appActions } from '../../app';
import mockData from '../../mockData';
import * as selectors from './../selectors';
import { Colors, BackgroundImage, IconButton, CircleImage } from '../../UI';
import _ from 'lodash';

const MenuItem = ({ label, image, icon, onPress, header, fontSize, bold }) => {
  if (header) {
    return (
      <View style={styles.menuItem}>
        <TextBase bold color={Colors.white}>
          {label}
        </TextBase>
      </View>
    );
  }
  return (
    <TouchableHighlight onPress={onPress} underlayColor={Colors.underlay}>
      <View style={styles.menuItem}>
        {image && <CircleImage size={70} source={{ uri: image }} style={{ marginRight: 16 }} />}
        <TextBase fontSize={fontSize} bold={bold} color={icon ? Colors.white : `${Colors.white}90`}>
          {label}
        </TextBase>
        {icon && <Icon name={icon} color={Colors.white} size={20} pl={1} style={{ paddingTop: 2 }} />}
      </View>
    </TouchableHighlight>
  );
};

class SideMenu extends Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    logout: React.PropTypes.func,
    user: React.PropTypes.object,
    goToFeed: React.PropTypes.func,
    goToUser: React.PropTypes.func,
    goToSettings: React.PropTypes.func,
    feeds: React.PropTypes.array,
    worldFeed: React.PropTypes.object,
  };
  static defaultProps = {
    user: mockData.users.abc,
    feeds: mockData.feedIds.map(id => mockData.feeds[id]),
    worldFeed: mockData.worldFeed
  };
  constructor(props) {
    super(props);
    this.onClosePress = this.onClosePress.bind(this);
    
    this.state = {
      feed: this.props.currentUser.universityFeed
    }
  }

  onClosePress() {
    this.props.navigator.toggleDrawer({
      to: 'closed',
      side: 'left',
      animated: true
    });
  }

  goToFeed(feed){
    this.setState({feed: feed.feed});
    this.props.goToFeed(feed);
    this.props.loadPosts(feed, this.props.filterId);
  }

  render() {
    const { logout, feeds, feed, worldFeed, goToUser, goToSettings } = this.props;
    const { _id, email, avatar, name, universityFeed, universityEmail } = this.props.currentUser;
    university = _.find(feeds, f => { return f.feed == universityFeed});
    const user = {_id: _id, avatar: avatar, name: name,
      university: university
    }

    console.log('USERSCURENT', user);
    return (
      <BackgroundImage source={require('../../img/Blur-BG.png')}>
        <View style={{ flex: 1, paddingTop: 30 }}>
          <MenuItem
            image={avatar}
            label={name}
            icon={'ios-arrow-forward'}
            onPress={() => goToUser(user)}
            fontSize={5}
          />
          <MenuItem key={universityFeed} header={this.state.feed === universityFeed} label={university ? university.name : ''} onPress={() => this.goToFeed(university)} />
          <View style={styles.divider} />
          <MenuItem label={worldFeed.name} onPress={() => this.goToFeed(worldFeed)} />
          <View style={styles.divider} />
          { this.props.feeds.length > 0 ?
            this.props.feeds.map(feed =>{
              return feed.feed != universityFeed ?
                (<MenuItem key={feed.feed} header={this.state.feed === feed.feed} label={feed.name} onPress={() => this.goToFeed(feed)} />)
                :
                null
            }
            )
            :
            null
          }
          <Base mb={2} flex={1} justify={'flex-end'}>
            <MenuItem fontSize={4} label={'Settings'} icon="ios-cog" onPress={goToSettings} />
            <MenuItem fontSize={4} label={'Logout'} icon="ios-exit-outline" onPress={logout} />
            {/*<IconButton color={Colors.secondaryLight} onPress={goToSettings} label="Settings" />*/}
            {/*<IconButton color={Colors.white} mt={2} onPress={logout} label="Logout" />*/}
          </Base>
        </View>
      </BackgroundImage>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: '500'
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightGrey,
    marginVertical: 4
  },
  menuItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center'
  }
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    feeds: state.feeds,
    feed: state.feed,
  }
}

export default connect(
  mapStateToProps,
  (dispatch, ownProps) => ({
    logout: () => dispatch(appActions.logout()),
    goToFeed: (feed) => {
      dispatch(actions.changeFeed(feed));
      ownProps.navigator.toggleDrawer({
        to: 'closed',
        side: 'left',
        animated: true
      });
    },
    loadPosts:(feed) => dispatch(actions.loadPosts(feed, '')),
    goToUser: (user) => {
      dispatch(actions.goToUser(user, ownProps.navigator));
    },
    goToSettings: () => dispatch(actions.goToSettings(ownProps.navigator))
  })
)(SideMenu);
