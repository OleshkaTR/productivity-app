import {settingsController} from './settings.controller';
import {settingsView} from './settings.view';
import {settingsModel} from './settings.model';
import {settingsService} from '../../services/settings.service';

jest.mock('../../router', () => ({
  history: () => ({
    push: jest.fn(),
  }),
}));
jest.mock('../../components/tabs/tabs');
jest.mock('../../components/buttons/buttons');

describe('Settings Controller', () => {
  describe('Init method', () => {
    test('method init should return undefined', () => {
      settingsView.render = jest.fn();
      settingsView.render();
      settingsController.settingStyle = jest.fn();
      settingsController.settingStyle();
      const returnValue = settingsController.init();
      expect(returnValue).toBeUndefined();
    });
    test('method init should called the settings view init', () => {
      const spy = jest.spyOn(settingsView, 'init');
      settingsController.init();
      expect(spy).toHaveBeenCalled();
    });
    test('method init should called the showNotification', () => {
      const spy = jest.spyOn(settingsController, 'showNotification');
      settingsController.init();
      expect(spy).toHaveBeenCalled();
    });
    test('method init should called the toTasks', () => {
      const spy = jest.spyOn(settingsController, 'toTasks');
      settingsController.init();
      expect(spy).toHaveBeenCalled();
    });
    test('method init should called the settingStyle', () => {
      const spy = jest.spyOn(settingsController, 'settingStyle');
      settingsController.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Init method', () => {
    test('method getSettings should return the array of object', () => {
      settingsModel.settings.forEach((el) => expect(typeof el)
          .toBe('object'));
    });
    test('method getSettings should return the array of object with field' +
      ' id', () => {
      expect(settingsModel.settings).toEqual(
          expect.arrayContaining([
            expect.objectContaining({id: 'work-input'}),
            expect.objectContaining({id: 'short-input'}),
            expect.objectContaining({id: 'iteration-input'}),
            expect.objectContaining({id: 'long-input'}),
          ]),
      );
    });
  });

  test('method sendOptions should be called settingsService sendData',
      async () => {
        const spy = jest.spyOn(settingsService, 'sendData');
        await settingsController.sendOptions();
        expect(spy).toHaveBeenCalled();
      });

  test('method showNotification should be called settingsService sendData',
      async () => {
        const spy = jest.spyOn(settingsService, 'sendData');
        settingsController.showNotification();
        console.log(spy);
        expect(spy).toHaveBeenCalled();
      });
});
