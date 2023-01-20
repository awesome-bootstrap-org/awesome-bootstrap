import { Entry } from "./Entry.js";
import { NPMEntry } from "./NPMEntry.js";
import { Page } from "./Page.js";
import { isBootstrapDeprecated } from "./utilities.js";

/**
 * Main function
 */
jQuery(function () {
  // Init
  const _DetailPage = new DetailPage();
});
export class DetailPage extends Page {
  /**
   * Create a new HomePage
   */
  constructor() {
    super();
    const loaderSpinner = this.spinner;
    $(DetailPage.bodySelector).append(loaderSpinner);
    let params = new URL(document.location).searchParams;
    this.entry = Entry.get(DOMPurify.sanitize(params.get("name")), this.root)
      .then((data) => {
        this.entry = data;
        $(DetailPage.headerSelector)
          .addClass("border-bottom border-3")
          .append($("<h2></h2>").text(this.entry.title));
        this.load().finally(() => {
          $(DetailPage.headerSelector).append(
            this.entry.renderHeaderBadges(DetailPage.root)
          );
          loaderSpinner.remove();
        });
      })
      .catch((error) => {
        $(DetailPage.bodySelector).append(
          DetailPage.renderAlert(
            error.message,
            "danger",
            `<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> ${
              error?.cause?.title || "Oups!"
            }`,
            false
          )
        );
        loaderSpinner.remove();
      });
  }

  /**
   * Get the path to root
   * @returns {String} path to root
   * @override
   */
  get root() {
    return "..";
  }

  /**
   * Get the body selector
   * @static
   * @returns {String} body selector
   */
  static get bodySelector() {
    return "#content-body";
  }

  /**
   * Get the header selector
   * @static
   * @returns {String} header selector
   */
  static get headerSelector() {
    return "#content-header";
  }

  /**
   * Fetch entry details form source and render
   * @returns {Promise}
   */
  load() {
    return new Promise((resolve, reject) => {
      switch (this.entry.source) {
        case "npm":
          this.entry = new NPMEntry({ ...this.entry });
          this.entry
            .load()
            .then(() => {
              DetailPage.appendMD(
                this.entry.readme,
                $(DetailPage.bodySelector)
              );
              resolve();
            })
            .catch((error) => {
              $(DetailPage.bodySelector).append(
                DetailPage.renderAlert(
                  error.message,
                  "danger",
                  `<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> ${
                    error?.cause?.title || "Oups!"
                  }`,
                  false
                )
              );
              reject();
            });
          break;

        default:
          $(DetailPage.bodySelector).append(
            DetailPage.renderAlert(
              `Currently we don't support detail page for ${this.entry.source} source.`,
              "info",
              `<i class="bi bi-exclamation-circle" aria-hidden="true"></i> ${
                error?.cause?.title || "Not Supported!"
              }`,
              false
            )
          );
          reject();
          break;
      }
    });
  }
}
