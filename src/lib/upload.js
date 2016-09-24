import RNFetchBlob from 'react-native-fetch-blob';
import { Platform } from 'react-native';
import * as firebase from 'firebase';

const fs = RNFetchBlob.fs
const Blob = RNFetchBlob.polyfill.Blob

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

exports.uploadImage = function(imageFile, id, type, object, refData){


  console.log("start upload");
  const dirs = RNFetchBlob.fs.dirs
  const prefix = ((Platform.OS === 'android') ? 'file://' : '')
  const imageName = `${id}`


  RNFetchBlob
  .config({ fileCache : true })
  .fetch('GET', imageFile)
  .then((resp) => {
    imageFile = resp.path();

    let rnfbURI = RNFetchBlob.wrap(imageFile)

    Blob
      .build(rnfbURI)
      .then((blob) => {
        firebase.storage()
          .ref(type)
          .child(imageName)
          .put(blob)
          .then((snapshot) => {
            blob.close()
            firebase
              .storage()
              .ref(`${type}/${id}`)
              .getDownloadURL().then((url) => {
                object.image = url

                let updates = {};
                updates[refData] = object;

                firebase.database().ref().update(updates);
                return true;
              })
          })
    })
  });


}
