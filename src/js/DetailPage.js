import { Entry } from "./Entry.js";
import { NPMEntry } from "./NPMEntry.js";
import { Page } from "./Page.js";
import { isBootstrapDeprecated } from "./utilities.js";

/**
 * Main function
 */
$().ready(function () {
  // Init
  const _DetailPage = new DetailPage();
});
export class DetailPage extends Page {
  /**
   * Create a new HomePage
   */
  constructor() {
    super();
    let params = new URL(document.location).searchParams;
    this.entry = Entry.get(params.get("name"), this.root)
      .then((data) => {
        this.entry = data;
        this.load();
      })
      .catch((error) => {
        $(DetailPage.mainSelector).append(
          DetailPage.renderAlert(
            error.message,
            "danger",
            `<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> ${
              error?.cause?.title || "Oups!"
            }`,
            false
          )
        );
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
   * Get the main selector
   * @static
   * @returns {String} main selector
   */
  static get mainSelector() {
    return "main";
  }

  load() {
    switch (this.entry.source) {
      case "npm":
        this.entry = new NPMEntry({ ...this.entry });
        this.entry
          .load()
          .then(() => {
            DetailPage.appendMD(this.entry.readme, $(DetailPage.mainSelector));
          })
          .catch((error) => {
            $(DetailPage.mainSelector).append(
              DetailPage.renderAlert(
                error.message,
                "danger",
                `<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> ${
                  error?.cause?.title || "Oups!"
                }`,
                false
              )
            );
          });
        break;

      default:
        $(DetailPage.mainSelector).append(
          DetailPage.renderAlert(
            `Currently we don't support detail page for ${this.entry.source} source.`,
            "info",
            `<i class="bi bi-exclamation-circle" aria-hidden="true"></i> ${
              error?.cause?.title || "Not Supported!"
            }`,
            false
          )
        );
        break;
    }
  }
}
