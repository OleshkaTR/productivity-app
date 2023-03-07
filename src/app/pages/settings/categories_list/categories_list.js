import * as markup from './categories_list.hbs';
import CategoriesListItem from '../categories_list_item/categories_list_item';
import {constantsCategories} from './constants_categories';

/** @class ReportGraph */
class CategoriesList {
  /**
   * @constructor Create a new instance of CategoriesList class
   * @param {string} containerId - Container ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  /** @description Render categories on the page */
  render() {
    this.container.innerHTML = markup(this);
    constantsCategories.forEach((item) => {
      new CategoriesListItem('categories-list', item);
    });
  }
}

export default CategoriesList;
