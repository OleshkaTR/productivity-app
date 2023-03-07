import {settingsView} from './settings.view';
import {buttons} from '../../components/buttons/buttons';
import {tabs} from '../../components/tabs/tabs';

jest.mock('../../router', () => ({
  history: () => ({
    push: jest.fn(),
  }),
}));
jest.mock('../../components/tabs/tabs');
jest.mock('../../components/buttons/buttons');

describe('Settings View', () => {
  describe('Init method', () => {
    test('method init should return undefined', () => {
      settingsView.render = jest.fn();
      const returnValue = settingsView.init();
      expect(returnValue).toBeUndefined();
    });
    test('method init should called the render', () => {
      const spy = jest.spyOn(settingsView, 'render');
      jest.spyOn(tabs, 'init');
      jest.spyOn(buttons, 'init');
      settingsView.init();
      expect(spy).toHaveBeenCalled();
    });
    test('method init should called the tabs init', () => {
      const spy = jest.spyOn(tabs, 'init');
      settingsView.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  test('method render should be a undefined', () => {
    const method = settingsView.render;
    expect(method()).toBeUndefined();
  });
});
