import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Base, TextBase } from 'panza';
import Colors from './Colors';
import ProfileStat from './ProfileStat';
import Avatar from './Avatar';
import { openSnapchat, openInstagram } from '../lib/linking';

const ProfileHeader = ({
  user: { avatar, name, reputation, snapchat, instagram },
  university,
  isOwner,
  onSnapchatChange,
  onChangeInstagram,
  ...props
}) => (
  <Base flex={1} justify="center" align="center" {...props}>
    <TextBase bold fontSize={2} color={Colors.secondary} numberOfLines={1}>{name}</TextBase>
    <TextBase mt={1} color={Colors.grey} numberOfLines={1} fontSize={5}>{university && university.name}</TextBase>
    <Base row justify="space-around" align="flex-end" mx={2} mt={3}>
      <ProfileStat
        flex={1}
        value={(reputation && reputation.toString()) || '0'}
        label={'Rep'}
      />
      {snapchat || isOwner ?
        <ProfileStat
          flex={1}
          value={snapchat}
          icon={require('../img/sc-icon.png')}
          placeholder="(i.e. junoapp)"
          editable={isOwner}
          onChangeText={onSnapchatChange}
          onPress={snapchat ? () => openSnapchat(snapchat) : null}
        />
        : null
      }
      {instagram || isOwner ?
        <ProfileStat
          flex={1}
          value={instagram}
          icon={require('../img/ig-icon.png')}
          placeholder="(i.e. junoapp)"
          editable={isOwner}
          onChangeText={onChangeInstagram}
          onPress={instagram ? () => openInstagram(instagram) : null}
        />
        : null
      }
    </Base>
    
  </Base>
);

ProfileHeader.propTypes = {
  user: React.PropTypes.object,
  isOwner: React.PropTypes.bool,
  onSnapchatChange: React.PropTypes.func,
  onChangeInstagram: React.PropTypes.func,
};

const styles = StyleSheet.create({
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGrey
  }
});

export default ProfileHeader;
