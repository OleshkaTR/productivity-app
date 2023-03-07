import {buttons} from './buttons';

jest.mock('../../router', () => ({
  history: () => ({
    push: jest.fn(),
  }),
}));

describe('Buttons', () => {
  describe('Init method', () => {
    test('method init should return undefined', () => {
      buttons.markup = jest.fn();
      buttons.render = jest.fn();
      buttons.addEventListeners = jest.fn();
      const returnValue = buttons.init();
      expect(returnValue).toBeUndefined();
    });
    test('method init should called the render', () => {
      const spy = jest.spyOn(buttons, 'render');
      buttons.markup = jest.fn();
      jest.spyOn(buttons, 'addEventListeners');
      buttons.init();
      expect(spy).toHaveBeenCalled();
    });
    test('method init should called the addEventListeners', () => {
      const spy = jest.spyOn(buttons, 'addEventListeners');
      buttons.markup = jest.fn();
      buttons.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Render method', () => {
    test('method render should return undefined', () => {
      const returnValue = buttons.render();
      expect(returnValue).toBeUndefined();
    });
    test('method render should called the markup', () => {
      buttons.markup = jest.fn();
      buttons.markup();
      buttons.render();
      expect(buttons.markup).toHaveBeenCalled();
    });
  });

  test('method addEventListeners should be a undefined', () => {
    const method = buttons.addEventListeners;
    expect(method()).toBeUndefined();
  });
});
