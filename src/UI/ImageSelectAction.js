import React from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import ImagePickerManager from 'react-native-image-picker';
import config from '../config';
import { Icon } from 'panza';
import Colors from './Colors';
const { RNUploader } = NativeModules;

export default class ImageSelectAction extends React.Component {
  static propTypes ={
    onSelect: React.PropTypes.func.isRequired,
    onError: React.PropTypes.func,
  };

  static defaultProps = {
    onSelect: () => {},
  };

  constructor(props) {
    super(props);
    this.onError = this.onError.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.state = {
      uploading: false
    };
  }

  onError(err) {
    if (this.props.onError) {
      this.props.onError(err);
    } else {
      Alert.alert('Error', err.message || err);
    }
  }

  showImagePicker() {
    ImagePickerManager.showImagePicker(
      {
        mediaType: 'photo',
        noData: false,
        quality: 0.1,
        maxWidth: 800
      },
      response => {
        if (!response.didCancel) {
          if (response.error) {
            this.onError(response.error);
          } else {
            // encode image to base64 to uplaod to firebase
            this.props.onSelect(response.uri, 'data:image/jpeg;base64,' + response.data);
          }
        }
      }
    );
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.showImagePicker}
      >
        <Icon
          color={Colors.secondary}
          name={'ios-camera-outline'}
          {...this.props}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    margin: 10,
  }
});
