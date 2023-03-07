import('./categories_list_item.less');
import * as markup from './categories_list_item.hbs';

/** @class ReportGraph */
export default class CategoriesListItem {
  /**
   * @constructor Create a new instance of CategoriesListItem class
   * @param {string} containerId - Container ID
   * @param {object} item - Object for render item
   */
  constructor(containerId, item) {
    this.item = item;
    this.container = document.getElementById(containerId);
    this.render();
  }

  /** @description Render categoriesListItem on the page */
  render() {
    this.container.innerHTML += markup(this.item);
  }
}
