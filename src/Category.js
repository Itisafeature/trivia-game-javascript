export default class Category {
  static #categories = [];

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static async getCategories() {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    data.trivia_categories.forEach(categoryData => {
      const category = new Category(categoryData.id, categoryData.name);
      Category.addCategory(category);
    });
  }

  static get allCategories() {
    return this.#categories;
  }
  static addCategory(category) {
    this.#categories.push(category);
  }
}
