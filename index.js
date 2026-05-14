import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// This dynamically hooks into your app.json to register the correct name
AppRegistry.registerComponent(appName, () => App);