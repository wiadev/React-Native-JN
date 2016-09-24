import React, { Component } from 'react';
import { ListView, StyleSheet, Text } from 'react-native';
import { TouchableRowCell, Base, PrimaryText, SecondaryText, TextBase, LoadingPage } from 'panza';
import { Colors, CircleImage, BackgroundImage } from '../UI';
import * as actions from './actions';
import { connect } from 'react-redux';
import { timeSince } from '../utils.js';

class NotificationScreen extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    handleNotification: React.PropTypes.func.isRequired,
    notifications: React.PropTypes.arrayOf(React.PropTypes.object),
    icons: React.PropTypes.object
  };
  static defaultProps = {
    notifications: [],
    icons: {
      'heart' : 'https://freeiconshop.com/files/edd/heart-compact-flat.png',
      'friend': 'https://freeiconshop.com/files/edd/star-flat.png',
      'comment': 'https://freeiconshop.com/files/edd/chat-flat.png'
    }
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (oldRow, newRow) => oldRow !== newRow
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(props.notifications)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications !== this.props.notifications) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.notifications)
      });
    }
  }

  renderRow(notification) {
    const { title, body, type, createdAt } = notification;
    const { icons } = this.props;

    return (
      <TouchableRowCell
        py={2}
        height={80}
        onPress={() => this.props.handleNotification(notification)}
        style={styles.borderTop}
      >
        <CircleImage size={48} source={{ uri: icons[type] }} style={{ marginRight: 16 }} />
        <Base flex={1} row align="center" justify="space-between">
          <Base flex={1}>

            {createdAt && (
              <TextBase color={`${Colors.white}55`} fontSize={6} numberOfLines={1}>{timeSince(createdAt)}</TextBase>
            )}
            {title && (
              <PrimaryText color={`${Colors.white}cc`} numberOfLines={1}>{title}</PrimaryText>
            )}
            {body && (
              <SecondaryText color={`${Colors.white}55`} numberOfLines={1}>{body}</SecondaryText>
            )}
          </Base>
        </Base>
      </TouchableRowCell>
    );
  }

  render() {
    const {notifications, loading, goToNotification} = this.props;
    const hasNotifications = notifications && notifications.length > 0;

    return (
      <BackgroundImage source={require('../img/Blur-BG.png')}>
        {!hasNotifications ? (
          loading ?
            <LoadingPage style={styles.absolute} />
            :
            <Base justify="center" align="center" style={styles.absolute}>
              <Text style={styles.text}>
                No Notifications
              </Text>
            </Base>
        )
          :
          null
        }
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          initialListSize={5}
          enableEmptySections
          removeClippedSubviews
          {...this.props}
        />
        
        
      </BackgroundImage>

    );
  }
}


const styles = StyleSheet.create({
  borderTop: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  absolute: { marginTop: 50 ,  top: 0, left: 0, right: 0, bottom: 0 },
});

class NotificationScreenWrapper extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    notifications: React.PropTypes.arrayOf(React.PropTypes.object),
    loadNotifications: React.PropTypes.func
  };
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.props.loadNotifications();
  }


  render() {
    const {notifications, loading, handleNotification} = this.props;
    
    return (
      <NotificationScreen
        notifications={notifications}
        loading={loading}
        handleNotification={handleNotification}
        
        {...this.props}
      />
    );
  }
}


const mapStateToProps = (state) => ({
  notifications: actions.getNotifications(state),
  loading: actions.getLoading(state),
  currentUser: state.currentUser
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadNotifications:() => dispatch(actions.loadNotifications()),
  handleNotification: (notif) => dispatch(actions.handleNotification(notif, ownProps.navigator))
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreenWrapper);
