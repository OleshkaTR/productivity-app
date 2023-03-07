/** @module settingsView */
import {buttons} from '../../components/buttons/buttons';
import {settingsController} from './settings.controller';
import {settingsService} from '../../services/settings.service';
import * as markup from './settings.hbs';
import PomodoroSettingsItemComponent
  from './pomodoro_settings_item/pomodoro_settings_item';
import PomodoroGraph from './pomodoro_graph/pomodoro_graph';
import {httpService} from '../../services/http.service';
import {router} from '../../router';
import {tabs} from '../../components/tabs/tabs';

import('./settings.less');

/**
 * @property {object} settingsView - Settings page an application.
 * @property {method} settingsView.init - Initialization a new settings
 component.
 * @property {method} settingsView.render - The render settings.
 */
export const settingsView = {
  init() {
    this.httpService = httpService;
    this.container = document.getElementById('main');
    this.settingsService = settingsService;
    this.router = router;
    this.render();
    tabs.init(true, false);
    buttons.init(false, false, true, false, false);
  },

  render() {
    this.container.innerHTML = markup(this);
    settingsController.getSettings().forEach((option) => {
      new PomodoroSettingsItemComponent('pomodoro-settings-list', option);
    });
    new PomodoroGraph('pomodoro-settings-cycle',
        settingsController.getSettings());
    document.querySelector('#header-title').innerText = 'Settings';
    document.querySelector('#specific_add').style.display = 'none';
    document.getElementById('icon-trash').style.display = 'none';
    document.getElementById('icon-add').style.display = 'none';
  },

};
