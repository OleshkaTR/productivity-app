import ReportView from './report.view';
import {tabs} from '../../components/tabs/tabs';
import {bus} from '../../eventBus';
import {router} from '../../router';
import {
  navigationArrow,
} from '../../components/navigation_arrow/navigation_arrow';

/** @class ReportGraph */
class ReportController {
  /**
   * @constructor Create a new instance of ReportController class
   * @param {boolean} taskReport - Reports for tasks
   * @param {boolean} pomodorosReport - Reports for pomodoros
   * @param {boolean} reportFromDay - Reports during the day
   * @param {boolean} reportFromWeek - Reports during the week
   * @param {boolean} reportFromMonth - Reports during the month
   */
  constructor(taskReport, pomodorosReport, reportFromDay, reportFromWeek,
      reportFromMonth) {
    document.getElementById('icon-list').classList
        .remove('active');
    document.getElementById('icon-statistics').classList
        .add('active');
    document.getElementById('icon-settings').classList
        .remove('active');
    document.getElementById('icon-trash').classList
        .remove('active');
    new ReportView(taskReport, pomodorosReport, reportFromDay, reportFromWeek,
        reportFromMonth);
    tabs.init(false, false, false, true, reportFromDay,
        reportFromWeek, reportFromMonth, taskReport, pomodorosReport);
    tabs.init(false, false, true, false, reportFromDay,
        reportFromWeek, reportFromMonth, taskReport, pomodorosReport);
    this.router = router;
    navigationArrow.init(false, false, true);
    this.goToTaskList();
  }

  /**
   * @description Navigate to tasks-list page
   */
  goToTaskList() {
    bus.subscribe('goToTasksList', () => {
      window.location.reload();
      document.getElementById('icon-list').classList
          .add('active');
      document.getElementById('icon-statistics').classList
          .remove('active');
      document.getElementById('icon-settings').classList
          .remove('active');
      document.getElementById('icon-trash').classList
          .remove('active');
    });
  }
}

export default ReportController;
