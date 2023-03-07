import {httpService} from './http.service';
import {tasksService} from './tasks.service';

/** @class TimerService */
class TimerService {
  /**
   * @constructor Create a new instance of timer service class
   * @param httpService - httpService
   */
  constructor(httpService) {
    this.httpService = httpService;
  }

  /**
   * @description Increase a estimation count
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async increaseEstimation(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    findTask.estimation++;
    await this.httpService.put(collectionName, findTask);
    await tasksService.getTasks(collectionName);
  }

  /**
   * @description Refresh progress bar, completed count, failed pomodoros and
   change task's status to daily list
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async refreshProgressBarArray(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    if (findTask.status !== 'COMPLETED') {
      findTask.progressBar = [];
      findTask.completedCount = 0;
      findTask.failedPomodoros = 0;
      findTask.status = 'DAILY_LIST';
      await this.httpService.put(collectionName, findTask);
      await tasksService.getTasks(collectionName);
    }
  }

  /**
   * @description Change array current progress bar
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   * @param {array} arr - Array of current progress bar
   * @return {array} - Return updated array progress bar
   */
  async updateProgressBarArray(collectionName, id, arr) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    findTask.progressBar = arr;
    await this.httpService.put(collectionName, findTask);
    await tasksService.getTasks(collectionName);
    return findTask.progressBar;
  }

  /**
   * @description Change current element from array progress bar
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   * @param {string} kindPomodoro - Kind pomodoro
   * @return {array} - Return updated array progress bar
   */
  async updateProgressBarArrayElement(collectionName, id, kindPomodoro) {
    const countPomodoros = document
        .querySelectorAll('.bg-image-pomodoro');
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    for (let i = 0; i < findTask.progressBar.length; i++) {
      if (i === findTask.completedCount) {
        if (kindPomodoro === 'failed') {
          findTask.progressBar[i] = '../../../images/tomato-failed.svg';
          await this.httpService.put(collectionName, findTask);
          await tasksService.getTasks(collectionName);
          countPomodoros[i].src = '../../../images/tomato-failed.svg';
        } else if (kindPomodoro === 'successful') {
          findTask.progressBar[i] = '../../../images/fill-tomato.svg';
          await this.httpService.put(collectionName, findTask);
          await tasksService.getTasks(collectionName);
          countPomodoros[i].src = '../../../images/fill-tomato.svg';
        }
      }
    }
    return findTask.progressBar;
  }
}

export const timerService = new TimerService(httpService);
