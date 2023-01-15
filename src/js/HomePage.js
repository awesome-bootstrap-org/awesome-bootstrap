import { Entrie } from "./Entrie.js";
import { Page } from "./Page.js";
import { isBootstrapDeprecated } from "./utilities.js";
export class HomePage extends Page {
  /**
   * Create a new HomePage
   */
  constructor() {
    super();
    // Load All entries
    Entrie.all(this.root)
      .then((all) => {
        this.all = all;
        this.search();
      })
      .catch((_error) => {
        $(HomePage.formSelector).append(
          HomePage.renderAlert(
            "There was an error loading the plugins infromation. Try in a few minutes and if the problem persists contact support.",
            "danger",
            '<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> Upss!'
          )
        );
      });

    // Bind action performed to search form
    $(`${HomePage.formSelector} input, ${HomePage.formSelector} select`).on(
      "input",
      (_e) => this.search()
    );
  }

  /**
   * Get the path to root
   * @returns {String} path to root
   * @override
   */
  get root() {
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
    $(HomePage.formSelector).find(".alert").remove();
    if (isBootstrapDeprecated(filterOptions.get("support"))) {
      $(HomePage.formSelector).append(
        HomePage.renderAlert(
          "The selected Bootstrap version is deprecated. We recommend upgrading your application to a version with active support.",
          "warning",
          '<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> Deprecation warning!'
        )
      );
    }

    const grid = $(HomePage.cardContainerSelector).html("");
    this.all
      .filter((entrie) => entrie.match(filterOptions))
      .forEach((entrie) => {
        grid.append(
          $('<div class="col"></div>').append(entrie.renderCard(this.root))
        );
      });
  }
}

/**
 * Main function
 */
$().ready(function () {
  // Init
  const _homepage = new HomePage();
});
