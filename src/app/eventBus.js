/** @class EventBus */
class EventBus {
  /** @constructor Create a new instance of event bus class */
  constructor() {
    this.eventCallbacksPairs = [];
  }

  /**
   * @description Subscribe on event
   * @param {string} eventType - Event type
   * @param {function} callback - Callback
   * @return {callback} callback - Callback
   */
  subscribe(eventType, callback) {
    const eventCallbacksPair = this.findEventCallbacksPair(eventType);

    if (eventCallbacksPair) {
      eventCallbacksPair.callbacks.push(callback);
    } else {
      this.eventCallbacksPairs.push(new EventCallbacksPair(eventType,
          callback));
    }
    return callback;
  }

  /**
   * @description Post event
   * @param {string} eventType - Event type
   * @param {any} [args] - Arguments(optional)
   */
  post(eventType, args) {
    const eventCallbacksPair = this.findEventCallbacksPair(eventType);

    if (!eventCallbacksPair) {
      console.error('no taskListSubscribers for event ' + eventType);
      return;
    }
    eventCallbacksPair.callbacks.forEach((callback) => callback(args));
  }

  /**
   * @description Find event callback pair
   * @param {string} eventType - Event type
   * @return {Object} - Event callback pairs
   */
  findEventCallbacksPair(eventType) {
    return this.eventCallbacksPairs.find((eventObject) =>
      eventObject.eventType === eventType);
  }
}

class EventCallbacksPair {
  /**
   * @constructor
   * @param {string} eventType - Event type
   * @param {function} callback - Callback
   */
  constructor(eventType, callback) {
    this.eventType = eventType;
    this.callbacks = [callback];
  }
}

export const bus = new EventBus();
