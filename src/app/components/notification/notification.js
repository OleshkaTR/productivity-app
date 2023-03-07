/** @module NotificationModule */

import('./notification.less');
import * as markup from './notification.hbs';

/**
 * @property {object} notification - Notifications all of application.
 * @property {method} notification.init - Initializations a new notification
 component.
 * @property {method} notification.render - The render for all notifications.
 * @property {method} notification.addEventListeners - Events for all of
 notifications.
 */
export const notification = {

  init(taskSuccessfulSave, taskSuccessfulRemove, timerFinishTask,
      settingsSuccessfulSaved, taskFailedSave, taskFailedRemove,
      timerFailedFinishPomodoro, taskFailedTaskToDaily, settingsFailedSaved,
      warningMessage, timerMarkedPomodoro, taskToDaily) {
    this.container = document.getElementById('for_notification');
    this.render(taskSuccessfulSave, taskSuccessfulRemove, timerFinishTask,
        settingsSuccessfulSaved, taskFailedSave, taskFailedRemove,
        timerFailedFinishPomodoro, taskFailedTaskToDaily, settingsFailedSaved,
        warningMessage, timerMarkedPomodoro, taskToDaily);
    this.addEventListeners();
  },

  render(taskSuccessfulSave, taskSuccessfulRemove, timerFinishTask,
      settingsSuccessfulSaved, taskFailedSave, taskFailedRemove,
      timerFailedFinishPomodoro, taskFailedTaskToDaily, settingsFailedSaved,
      warningMessage, timerMarkedPomodoro, taskToDaily) {
    this.container.insertAdjacentHTML('beforeend', markup(this));
    (function($) {
      const specificText = () => {
        if (taskSuccessfulSave) {
          return '<p>Your task was successfully saved</p>';
        }
        if (taskSuccessfulRemove) {
          return '<p>Your task was successfully removed</p>';
        }
        if (timerFinishTask) {
          return '<p>You finished task!</p>';
        }
        if (settingsSuccessfulSaved) {
          return '<p>Settings was successfully saved</p>';
        }
        if (taskFailedSave) {
          return '<p>Unable to save your task. Try again later</p>';
        }
        if (taskFailedRemove) {
          return '<p>Unable to remove task. Try again later</p>';
        }
        if (timerFailedFinishPomodoro) {
          return '<p>Unable to mark pomodoro/task as completed.' +
            ' Try again later</p>';
        }
        if (taskFailedTaskToDaily) {
          return '<p>Unable to move to the daily task list.' +
            ' Try again later</p>';
        }
        if (settingsFailedSaved) {
          return '<p>Unable to save settings. Try again later</p>';
        }
        if (warningMessage) {
          return '<p>Long break started, please have a rest!</p>';
        }
        if (timerMarkedPomodoro) {
          return '<p>You finished pomodoro!</p>';
        }
        if (taskToDaily) {
          return '<p>You task was moved to the daily task list</p>';
        }
      };

      $.fn.notification = function(options) {
        const settings = $.extend({
          content: specificText(),
        }, options);

        return this.html(settings.content);
      };

      const countDown = () => {
        setTimeout(() => {
          $('.notification').remove();
        }, 5000);
      };

      if (taskSuccessfulSave || taskSuccessfulRemove || timerFinishTask ||
        settingsSuccessfulSaved) {
        $('.message').addClass('block-message-successful');
        $('.for-icon').addClass('icon-pomodoro-successful-container');
        $('#icon-notification').addClass('icon-tomato-success')
            .css({fontSize: '32px'});
        $('.ml-message').notification().addClass('white-text');
        return countDown();
      }
      if (taskFailedSave || taskFailedRemove || timerFailedFinishPomodoro ||
        taskFailedTaskToDaily || settingsFailedSaved) {
        $('.message').addClass('block-message-error');
        $('.for-icon').addClass('icon-pomodoro-error-container');
        $('#icon-notification').addClass('icon-tomato-error')
            .css({fontSize: '32px'});
        $('.ml-message').notification().addClass('white-text');
        return countDown();
      }
      if (warningMessage) {
        $('.message').addClass('block-message-warning');
        $('.for-icon').addClass('icon-pomodoro-warning-container');
        $('#icon-notification').addClass('icon-tomato-warning')
            .css({fontSize: '32px'});
        $('.ml-message').notification().addClass('white-text');
        return countDown();
      }
      if (timerMarkedPomodoro || taskToDaily) {
        $('.message').addClass('block-message');
        $('.for-icon').addClass('icon-pomodoro-container');
        $('#icon-notification').addClass('icon-tomato-success')
            .css({fontSize: '32px'});
        $('.ml-message').notification().addClass('white-text');
        return countDown();
      }
    }(jQuery));
  },

  addEventListeners() {
    document.getElementById('close-notification')
        .addEventListener('click', () => {
          this.container.querySelector('.notification').remove();
        });
  },
};
