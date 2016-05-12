/* flow */

import React, {
  AppState,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  PushNotificationIOS,
} from 'react-native';

let GcmNativeModule = NativeModules.RNGCM;
if (Platform.OS === 'android') {
  GcmNativeModule = NativeModules.GcmModule;
}

// Constants
const EVENT_NOTIFICATION_RECEIVED: string = 'GCMRemoteNotificationReceived';
const EVENT_NOTIFICATION_REGISTERED: string = 'GCMRemoteNotificationRegistered';
const LISTENER_TYPE_NOTIFICATION: string = 'notification';
const LISTENER_TYPE_REGISTER: string = 'register';
const LISTENER_TYPES: Array = [LISTENER_TYPE_NOTIFICATION, LISTENER_TYPE_REGISTER];

function isFromBackground(isInForeground = null) {
  if(isInForeground === null) {
    if (Platform.OS === 'ios') {
      isInForeground = AppState.currentState === 'active';
    }
  }
  return !isInForeground
}

class GcmPushNotification {
  static handlers = new Map();
  static addEventListener(type: string, handler: Function) {
    if (LISTENER_TYPES.indexOf(type) === -1) return;

    let listener;
    if (type === LISTENER_TYPE_NOTIFICATION) {
      listener = DeviceEventEmitter.addListener(
        EVENT_NOTIFICATION_RECEIVED,
        data => handler(new GcmPushNotification(data))
      );
    } else if (type === LISTENER_TYPE_REGISTER) {
      listener = DeviceEventEmitter.addListener(
        EVENT_NOTIFICATION_REGISTERED,
        registrationInfo => handler(registrationInfo)
      );
    }
    GcmPushNotification.handlers.set(handler, listener);
  }

  static removeEventListener(type: string, handler: Function) {
    const listener = GcmPushNotification.handlers.get(handler);
    if (!listener) return;

    listener.remove();
    GcmPushNotification.handlers.delete(handler);
  }

  static requestPermissions(permissions: ?Object) {
    GcmNativeModule.requestPermissions(permissions);
  }

  static popInitialNotification() {
    let { initialNotification } = GcmNativeModule;
    if (!initialNotification) return;

    return new GcmPushNotification(initialNotification);
  }

  static subscribeTopic(topic: string, callback: Function){
    GcmNativeModule.subscribeTopic(topic, callback)
  }

  static unsubscribeTopic(topic: string, callback: Function){
    GcmNativeModule.unsubscribeTopic(topic, callback)
  }

  /* iOS specific starts */
  static setApplicationIconBadgeNumber(n: number) {
    if (Platform.OS === 'ios') {
      return PushNotificationIOS.setApplicationIconBadgeNumber(n);
    }
  }

  static getApplicationIconBadgeNumber() {
    if (Platform.OS === 'ios') {
      return PushNotificationIOS.getApplicationIconBadgeNumber();
    }
  }

  static checkPermissions(callback: Function) {
    if (Platform.OS === 'ios') {
      return PushNotificationIOS.checkPermissions(callback);
    }
  }

  static abandonPermissions() {
    if (Platform.OS === 'ios') {
      return PushNotificationIOS.abandonPermissions();
    }
  }
  /* iOS specific end */

  /* Android specific starts */
  static stopService() {
    if (Platform.OS === 'android') {
      GcmNativeModule.stopService();
    }
  }
  static createNotification(infos) {
    if (Platform.OS === 'android') {
      GcmNativeModule.createNotification(infos);
    }
  }
  /* Android specific ends */

  constructor(data: Object) {
    // Parse the notification on android devices
    if (Platform.OS === 'android') {
      data = JSON.parse(data.dataJSON);
    }
    this.data = Object.assign({}, data, {
      foreground: !isFromBackground(data.isInForeground),
    });
  }
}

export default GcmPushNotification;
