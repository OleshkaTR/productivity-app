/** @module reportModel */
import {reportsService} from '../../services/reports.service';

/**
 * @property {object} reportModel - reportModel of application.
 * @property {method} reportModel.getDoneTasks - Returns an object with arrays
 completed tasks.
 * @property {method} reportModel.getFilteredTasksOnAWeek -  Returns an object
 with arrays completed tasks of the week.
 */
export const reportModel = {

  async getDoneTasks() {
    return await reportsService.getFilteredDoneTask('Tasks');
  },

  getFilteredTasksOnAWeek(period, completedTasksArray) {
    return reportsService.calculateTasks(period, completedTasksArray);
  },
};
