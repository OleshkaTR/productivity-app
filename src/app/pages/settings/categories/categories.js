/** @module categories */
import {tabs} from '../../../components/tabs/tabs';
import * as markup from './categories.hbs';
import CategoriesList from '../categories_list/categories_list';
import {router} from '../../../router';
import {buttons} from '../../../components/buttons/buttons';

import('./categories.less');

/**
 * @property {object} categories - Categories page of application
 * @property {method} categories.init - Initialization a new categories
 component
 * @property {method} categories.render - The render categories
 * @property {method} categories.addEventListeners - Events of
 categories
*/
export const categories = {
  init() {
    this.container = document.getElementById('main');
    document.getElementById('icon-list').classList.remove('active');
    document.getElementById('icon-statistics').classList.remove('active');
    document.getElementById('icon-settings').classList.add('active');
    document.getElementById('icon-trash').classList.remove('active');
    this.render();
    this.router = router;
    tabs.init(false, true);
    buttons.init(false, false, false, true, false);
    this.addEventListeners();
  },

  render() {
    this.container.innerHTML = markup(this);
    new CategoriesList('categories');
    document.getElementById('icon-trash').style.visibility = 'hidden';
    document.getElementById('icon-add').style.display = 'none';
  },

  addEventListeners() {
    document.querySelector('.btn-main').addEventListener('click', () => {
      window.location.reload();
      document.getElementById('icon-list').classList.add('active');
      document.getElementById('icon-statistics').classList.remove('active');
      document.getElementById('icon-settings').classList.remove('active');
      document.getElementById('icon-trash').classList.remove('active');
    });
  },
};
