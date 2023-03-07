import('./report.less');
import ReportGraph from './report_graph/report_graph';
import * as markup from './report.hbs';
import {bus} from '../../eventBus';

/** @class ReportView */
export default class ReportView {
  /**
   * @constructor Create a new instance of ReportController class
   * @param {boolean} tasksReport - Reports for tasks
   * @param {boolean} pomodorosReport - Reports for pomodoros
   * @param {boolean} reportFromDay - Reports during the day
   * @param {boolean} reportFromWeek - Reports during the week
   * @param {boolean} reportFromMonth - Reports during the month
   */
  constructor(tasksReport, pomodorosReport, reportFromDay, reportFromWeek,
      reportFromMonth) {
    this.container = document.getElementById('main');
    this.render(tasksReport, pomodorosReport, reportFromDay, reportFromWeek,
        reportFromMonth);
  }

  /**
   * @description Render reports on the page
   * @param {boolean} tasksReport - Reports for tasks
   * @param {boolean} pomodorosReport - Reports for pomodoros
   * @param {boolean} reportFromDay - Reports during the day
   * @param {boolean} reportFromWeek - Reports during the week
   * @param {boolean} reportFromMonth - Reports during the month
   */
  render(tasksReport, pomodorosReport, reportFromDay, reportFromWeek,
      reportFromMonth) {
    this.container.innerHTML = markup(this);
    new ReportGraph('report', tasksReport, pomodorosReport,
        reportFromDay, reportFromWeek, reportFromMonth);
    document.querySelector('#header-title').innerText = 'Reports';
    document.querySelector('#specific_add').style.display = 'none';
    document.getElementById('icon-trash').style.display = 'none';
    document.getElementById('icon-add').style.display = 'none';
    this.addEventListener();
  }

  /** @description All events listeners of ReportView */
  addEventListener() {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('icon-arrow-left')) {
        bus.post('goToTasksList');
      }
    });
  }
};
