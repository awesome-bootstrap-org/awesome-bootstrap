import { Entrie } from "./Entrie.js";

export class HomePage {
  /**
   * Create a new HomePage
   */
  constructor() {
    // Load All entries
    Entrie.all(HomePage.root).then((all) => {
      this.all = all;
      this.search();
    });

    // Bind action performed to search form
    $(`${HomePage.formSelector} input, ${HomePage.formSelector} select`).on(
      "input",
      (_e) => this.search()
    );
  }

  /**
   * Get the path to root
   * @static
   * @returns {String} path to root
   */
  static get root() {
    return ".";
  }

  /**
   * Get the search form selector
   * @static
   * @returns {String} search form selector
   */
  static get formSelector() {
    return "form";
  }

  /**
   * Get the card container selector
   * @static
   * @returns {String} scard container selector
   */
  static get cardContainerSelector() {
    return "#entries";
  }

  /**
   * Get filter options
   * @static
   * @returns {Map} filter options
   */
  static get filterOptions() {
    return $(HomePage.formSelector)
      .serializeArray()
      .reduce(
        (map, current) => map.set(current.name, current.value.toLowerCase()),
        new Map()
      );
  }

  /**
   * Search entries
   */
  search() {
    const filterOptions = HomePage.filterOptions;
    const grid = $(HomePage.cardContainerSelector).html("");
    this.all
      .filter((entrie) => entrie.match(filterOptions))
      .forEach((entrie) => {
        grid.append($('<div class="col"></div>').append(entrie.renderCard()));
      });
  }
}
