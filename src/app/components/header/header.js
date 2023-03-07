import {bus} from '../../eventBus';
import * as markup from './header.hbs';
import {links} from './header.config';
import {router} from '../../router';

import('./header.less');

/** @class HeaderComponent */
class HeaderComponent {
  /**
   * @constructor Create a new instance of header class
   * @param {string} containerId - Container ID
   */
  constructor(containerId) {
    this.links = links;
    this.container = document.getElementById(containerId);
    this.render();
    this.router = router;
    this.countTask();
    this.refreshClicksSubscribe();
  }

  /** @description Render header on the page */
  render() {
    this.container.innerHTML = markup(this.links);
    this.shadow = document.getElementById('box-shadow');
    this.headerTitleHidden = document
        .getElementById('block-header-title');
    this.imgPomodoroHeader = document
        .getElementById('img-pomodoro-header');
    this.iconAdd = document.getElementById('icon-add');
    this.specificAdd = document.getElementById('specific_add');
    this.iconTrash = document.getElementById('icon-trash');
    this.iconStatistics = document.getElementById('icon-statistics');
    this.iconSettings = document.getElementById('icon-settings');
    this.iconList = document.getElementById('icon-list');
    this.iconAdd.style.visibility = 'hidden';
    this.clicks = 0;
    this.addEventListeners();
  }

  /**
   * @description All events listeners of HeaderModule
   */
  addEventListeners() {
    window.addEventListener('scroll', () => {
      this.scrollposY = window.scrollY;

      if (this.scrollposY > 0) {
        this.shadow.classList.add('shadow');
        this.headerTitleHidden.style.display = 'none';
        this.imgPomodoroHeader.style.display = 'block';
        this.iconAdd.style.visibility = 'visible';
      } else {
        this.shadow.classList.remove('shadow');
        this.headerTitleHidden.style.display = 'flex';
        this.imgPomodoroHeader.style.display = 'none';
        this.iconAdd.style.visibility = 'hidden';
      }
    });

    this.iconAdd.addEventListener('click', (e) => {
      e.preventDefault();
      this.iconAdd.classList.add('active');
      this.iconTrash.classList.remove('active');
      this.iconList.classList.remove('active');
      this.iconStatistics.classList.remove('active');
      this.iconSettings.classList.remove('active');
      bus.post('showModal');
      if (sessionStorage.getItem('isNewUser') &&
        !sessionStorage.getItem('wasTask')) {
        document.querySelector('.wrapper')
            .classList.add('specify_modals');
      }
      if (sessionStorage.getItem('isNewUser') &&
        sessionStorage.getItem('wasTask')) {
        document.querySelector('.wrapper')
            .classList.remove('specify_modals');
        document.querySelector('.wrapper').classList.add('modals');
      }
      if (sessionStorage.getItem('isNewUser') &&
        !sessionStorage.getItem('wasTask') &&
        sessionStorage.getItem('emptyArray')) {
        document.querySelector('.wrapper')
            .classList.remove('modals');
        document.querySelector('.wrapper')
            .classList.add('empty_task_list');
      }
    });

    this.iconList.addEventListener('click', (e) => {
      e.preventDefault();
      this.iconList.classList.add('active');
      this.iconAdd.classList.remove('active');
      this.iconTrash.classList.remove('active');
      this.iconStatistics.classList.remove('active');
      this.iconSettings.classList.remove('active');
      window.location.reload();
    });

    this.iconStatistics.addEventListener('click', (e) => {
      e.preventDefault();
      this.iconStatistics.classList.add('active');
      this.iconAdd.classList.remove('active');
      this.iconList.classList.remove('active');
      this.iconTrash.classList.remove('active');
      this.iconSettings.classList.remove('active');
      this.router.navigate('reports/day/tasks');
    });

    this.iconSettings.addEventListener('click', (e) => {
      e.preventDefault();
      this.iconSettings.classList.add('active');
      this.iconAdd.classList.remove('active');
      this.iconList.classList.remove('active');
      this.iconStatistics.classList.remove('active');
      this.iconTrash.classList.remove('active');
      this.router.navigate('settings/pomodoros');
    });

    this.iconTrash.addEventListener('click', (e) => {
      e.preventDefault();
      this.clicks += 1;
      this.iconTrash.classList.add('active');
      this.iconAdd.classList.remove('active');
      this.iconList.classList.remove('active');
      this.iconStatistics.classList.remove('active');
      this.iconSettings.classList.remove('active');
      bus.post('removeMode', this.clicks);
    });

    this.specificAdd.addEventListener('click', () => {
      bus.post('showModal');
      if (sessionStorage.getItem('isNewUser') &&
        !sessionStorage.getItem('wasTask')) {
        document.querySelector('.wrapper')
            .classList.add('specify_modals');
      }
      if (sessionStorage.getItem('isNewUser') &&
        sessionStorage.getItem('wasTask')) {
        document.querySelector('.wrapper')
            .classList.add('modals');
      }
      if (sessionStorage.getItem('isNewUser') &&
        !sessionStorage.getItem('wasTask') &&
        sessionStorage.getItem('emptyArray')) {
        document.querySelector('.wrapper')
            .classList.remove('modals');
        document.querySelector('.wrapper')
            .classList.add('empty_task_list');
      }
    });
  }

  refreshClicksSubscribe() {
    bus.subscribe('refreshClicks', () => {
      this.clicks = 0;
    });
  }

  countTask() {
    bus.subscribe('CountDeleteTasks', (count) => {
      this.iconTrash.innerHTML = '<span class="count-delete-task"></span>';
      const countDelete = document.querySelector('.count-delete-task');
      countDelete.dataset.content = `${count}`;
    });
  }
}

export default HeaderComponent;
