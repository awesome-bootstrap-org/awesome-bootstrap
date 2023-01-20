import { Entry } from "./Entry.js";
import { Page } from "./Page.js";
import { isBootstrapDeprecated } from "./utilities.js";

/**
 * Main function
 */
jQuery(function () {
  // Init
  const _homepage = new HomePage();
});
export class HomePage extends Page {
  /**
   * Create a new HomePage
   */
  constructor() {
    super();
    const spinner = this.spinner;
    $(HomePage.formSelector).append(spinner);
    // Load All entries
    Entry.all(this.root)
      .then((all) => {
        this.all = all;
        this.search();
      })
      .catch((error) => {
        $(HomePage.formSelector).append(
          HomePage.renderAlert(
            error.message,
            "danger",
            `<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> ${
              error?.cause?.title || "Oups!"
            }`,
            false
          )
        );
      })
      .finally(() => {
        spinner.remove();
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
      .filter((entry) => entry.match(filterOptions))
      .forEach((entry) => {
        grid.append(
          $('<div class="col"></div>').append(entry.renderCard(this.root))
        );
      });
  }
}
