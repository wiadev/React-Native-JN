const LOCALHOST = 'localhost';

// Use different options for dev/production
const getFirebase = (env) => {
  switch (env) {
    case 'prod':
      return {
        firebaseConfig: {
          apiKey: '<your-api-key>',
          authDomain: '<your-auth-domain>',
          databaseURL: '<your-database-url>',
          storageBucket: '<your-storage-bucket>',
        }
      };
    case 'dev':
    default:
      return {
        firebaseConfig: {
          apiKey: 'AIzaSyBSR-yrTaqyISuFLrD3GkxTARQpL1bPeoY',
          authDomain: 'juno-9f3d2.firebaseapp.com',
          databaseURL: 'https://juno-9f3d2.firebaseio.com',
          storageBucket: 'juno-9f3d2.appspot.com',
        }
      };
  }
};

const config = {
  env: 'dev', // 'dev' or 'prod'
  runRemoteDev: false,
  uploadUrl: '<your-upload-url>',
  imagePath: '<url-to-images-root>',
  remoteDev: {
    name: 'Juno',
    hostname: LOCALHOST,
    port: '8000'
  },
  firebaseConfig: {},
  keyFcm: 'AIzaSyBSR-yrTaqyISuFLrD3GkxTARQpL1bPeoY',
  instagram: {
    client_id: 'a9e790d16b3b4c838464610b83400d33',
    redirect_url: 'iga9e790d16b3b4c838464610b83400d33://authorize'  // e.g.: 'test://init'
  }
};

Object.assign(config, getFirebase(config.env));

export default config;
