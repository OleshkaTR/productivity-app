/** @module settingsModel */
import {settingsService} from '../../services/settings.service';

/**
 * @property {object} settingsModel - Settings page an application.
 * @property {method} settingsModel.getValueWorkInput - Return object with
 work options.
 * @property {method} settingsModel.getValueShortBreakInput -  Return
 object with short break options.
 * @property {method} settingsModel.getValueIterationInput - Return object
 with iteration options.
 * @property {method} settingsModel.getValueLongBreakInput - Return object
 with long break options.
 */
export const settingsModel = {
  currentSettings: null,
  settings: [
    {
      value: 15,
      other: 'work-graph',
      id: 'work-input',
      title: 'WORK TIME',
      max: 25,
      min: 15,
      styleClass: 'work-time',
      unit: 'minutes',
      step: 5,
    },
    {
      value: 3,
      other: 'short-graph',
      id: 'short-input',
      title: 'SHORT BREAK',
      max: 5,
      min: 2,
      styleClass: 'short-brake',
      unit: 'iterations',
      step: 1,
    },
    {
      value: 4,
      other: 'iteration-graph',
      id: 'iteration-input',
      title: 'WORK ITERATION',
      max: 5,
      min: 3,
      styleClass: 'work-iter',
      unit: 'minutes',
      step: 1,
    },
    {
      value: 25,
      other: 'long-graph',
      id: 'long-input',
      title: 'LONG BREAK',
      max: 30,
      min: 15,
      styleClass: 'long-brake',
      unit: 'minutes',
      step: 5,
    },
  ],

  async getValueWorkInput() {
    return await settingsService.getWorkValue('Settings',
        'work-input');
  },

  async getValueShortBreakInput() {
    return await settingsService.getShortBreakValue('Settings',
        'short-input');
  },

  async getValueIterationInput() {
    return await settingsService.getWorkIterationValue('Settings',
        'iteration-input');
  },

  async getValueLongBreakInput() {
    return await settingsService.getLongBreakValue('Settings',
        'long-input');
  },
};
