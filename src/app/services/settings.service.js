import {httpService} from './http.service';

/** @class SettingsService */
class SettingsService {
  /**
   * @constructor Create a new instance of settings service class
   * @param httpService - httpService
   */
  constructor(httpService) {
    this.httpService = httpService;
  }

  /**
   * @description Get value work
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   * @return {object} - Return object with value work
   */
  async getWorkValue(collectionName, id) {
    const settings = await this.httpService.get(collectionName);
    const findWork = settings.find((setting) => setting.id === id);
    return findWork;
  }

  /**
   * @description Get value long break
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   * @return {object} - Return object with value long break
   */
  async getLongBreakValue(collectionName, id) {
    const settings = await this.httpService.get(collectionName);
    const findLongBreak = settings.find((setting) => setting.id === id);
    return findLongBreak;
  }

  /**
   * @description Get count work iteration
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   * @return {object} - Return object with count work iteration
   */
  async getWorkIterationValue(collectionName, id) {
    const settings = await this.httpService.get(collectionName);
    const findWorkIteration = settings.find((setting) => setting.id === id);
    return findWorkIteration;
  }

  /**
   * @description Get value short break
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   * @return {object} - Return object with value short break
   */
  async getShortBreakValue(collectionName, id) {
    const settings = await this.httpService.get(collectionName);
    const findShortBreak = settings.find((setting) => setting.id === id);
    return findShortBreak;
  }

  /**
   * @description Send data on the BD
   * @param {string} collectionName - Collection name
   * @param {string} entity - Name saved option
   */
  async sendData(collectionName, entity) {
    await this.httpService.put(collectionName, entity);
  }
}

export const settingsService = new SettingsService(httpService);
