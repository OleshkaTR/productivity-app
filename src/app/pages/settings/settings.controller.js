/** @module settingsController */
import {settingsView} from './settings.view';
import {settingsModel} from './settings.model';
import {settingsService} from '../../services/settings.service';
import {bus} from '../../eventBus';
import {router} from '../../router';
import {notification} from '../../components/notification/notification';

/**
 * @property {object} settingsController - Settings page an application.
 * @property {method} settingsController.init - Initialization a new settings
 component.
 * @property {method} settingsController.settingStyle -  Styles for header when
 init settings.
 * @property {method} settingsController.getSettings - Return an array with
 settings.
 * @property {method} settingsController.sendOptions - Send options on DB.
 * @property {method} settingsController.showNotification - Show a notification
 after save options.
 * @property {method} settingsController.toTasks - Navigate to tasks-list page.
 */
export const settingsController = {
  init() {
    this.settingsService = settingsService;
    settingsModel.currentSettings = settingsModel.settings[0];
    this.router = router;
    settingsView.init();
    this.showNotification();
    this.toTasks();
    this.settingStyle();
  },

  settingsSubscribers: {},

  settingStyle() {
    document.getElementById('icon-list').classList.remove('active');
    document.getElementById('icon-statistics').classList.remove('active');
    document.getElementById('icon-settings').classList.add('active');
    document.getElementById('icon-trash').classList.remove('active');
  },

  getSettings() {
    return settingsModel.settings;
  },

  async sendOptions() {
    for (const option of settingsModel.settings) {
      await this.settingsService.sendData('Settings', option);
    }
  },

  showNotification() {
    if (!this.settingsSubscribers.sendSettingsData) {
      this.settingsSubscribers.sendSettingsData = bus
          .subscribe('sendSettingsData', async () => {
            this.sendOptions().then((response) => {
              if (response) {
                notification.init(false, false, false, false,
                    false, true, false, false, true);
              } else {
                notification.init(false, false, false, true);
              }
            });
            document.getElementById('icon-list')
                .classList.add('active');
            document.getElementById('icon-statistics')
                .classList.remove('active');
            document.getElementById('icon-settings')
                .classList.remove('active');
            document.getElementById('icon-trash')
                .classList.remove('active');
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          });
    }
  },

  toTasks() {
    if (!this.settingsSubscribers.toTasks) {
      this.settingsSubscribers.toTasks = bus.subscribe('toTasks', () => {
        window.location.reload();
      });
    }
  },

};
