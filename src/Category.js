export default class Category {
  static #categories = [];

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
  static get allCategories() {
    return this.#categories;
  }
  static addCategory(category) {
    this.#categories.push(category);
  }
}
