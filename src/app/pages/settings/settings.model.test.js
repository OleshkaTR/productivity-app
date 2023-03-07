import {settingsModel} from './settings.model';
import {settingsService} from '../../services/settings.service';

describe('Settings Model', () => {
  describe('GetValueWorkInput method', () => {
    test('method getValueWorkInput should return object', async () => {
      const returnValue = await settingsModel.getValueWorkInput();
      expect(typeof returnValue).toBe('object');
    });
    test('method getValueWorkInput should return object, his value must' +
      ' to divide without remainder on 5', async () => {
      const returnValue = await settingsModel.getValueWorkInput();
      const res = !(returnValue.value % 5);
      expect(res).toBeTruthy();
    });
    test('method getValueWorkInput should return object, his value must' +
      ' be a number', async () => {
      const returnValue = await settingsModel.getValueWorkInput();
      expect(typeof returnValue.value).toBe('number');
    });
    test('method getValueWorkInput should be called settingsService' +
      ' getWorkValue', async () => {
      const spy = jest.spyOn(settingsService, 'getWorkValue');
      await settingsModel.getValueWorkInput();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('GetShortBreakValue method', () => {
    test('method getValueShortBreakInput should return object',
        async () => {
          const returnValue = await settingsModel.getValueShortBreakInput();
          expect(typeof returnValue).toBe('object');
        });
    test('method getValueShortBreakInput should return object, his value' +
      ' must be 2 to 5', async () => {
      const returnValue = await settingsModel.getValueShortBreakInput();
      const value = returnValue.value === 2 ? true : returnValue.value === 3 ?
        true : returnValue.value === 4 ? true : returnValue.value === 5;
      expect(value).toBeTruthy();
    });
    test('method getValueShortBreakInput should return object, his value ' +
      'must be a number', async () => {
      const returnValue = await settingsModel.getValueShortBreakInput();
      expect(typeof returnValue.value).toBe('number');
    });
    test('method getValueShortBreakInput should be called settingsService' +
      ' getShortBreakValue', async () => {
      const spy = jest.spyOn(settingsService, 'getShortBreakValue');
      await settingsModel.getValueShortBreakInput();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getValueIterationInput method', () => {
    test('method getValueIterationInput should return object',
        async () => {
          const returnValue = await settingsModel.getValueIterationInput();
          expect(typeof returnValue).toBe('object');
        });
    test('method getValueIterationInput should return object, his value' +
      ' must be 3 to 5', async () => {
      const returnValue = await settingsModel.getValueIterationInput();
      const value = returnValue.value === 3 ? true : returnValue.value === 4 ?
        true : returnValue.value === 5;
      expect(value).toBeTruthy();
    });
    test('method getValueIterationInput should return object, his value' +
      ' must be a number', async () => {
      const returnValue = await settingsModel.getValueIterationInput();
      expect(typeof returnValue.value).toBe('number');
    });
    test('method getValueIterationInput should be called settingsService' +
      ' getWorkIterationValue', async () => {
      const spy = jest.spyOn(settingsService, 'getWorkIterationValue');
      await settingsModel.getValueIterationInput();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('GetValueLongBreakInput method', () => {
    test('method getValueLongBreakInput should return object', async () => {
      const returnValue = await settingsModel.getValueLongBreakInput();
      expect(typeof returnValue).toBe('object');
    });

    test('method getValueLongBreakInput should return object, his value' +
      ' must to divide without remainder on 5', async () => {
      const returnValue = await settingsModel.getValueLongBreakInput();
      const res = !(returnValue.value % 5);
      expect(res).toBeTruthy();
    });
    test('method getValueLongBreakInput should return object, his value' +
      ' must be a number', async () => {
      const returnValue = await settingsModel.getValueLongBreakInput();
      expect(typeof returnValue.value).toBe('number');
    });
    test('method getValueLongBreakInput should be called settingsService' +
      ' getLongBreakValue', async () => {
      const spy = jest.spyOn(settingsService, 'getLongBreakValue');
      await settingsModel.getValueLongBreakInput();
      expect(spy).toHaveBeenCalled();
    });
  });
});
