import { Entry } from "./Entry.js";

export class NPMEntry extends Entry {
  static #npmEndpoint = "https://registry.npmjs.org/";
  /**
   * Create a new NPM Entry
   * @param {Object} entry
   */
  constructor(entry) {
    super(entry);
  }

  /**
   * Fetch Entry data from source
   * @returns {Promise}
   */
  load() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${NPMEntry.#npmEndpoint}${this.name}`,
        method: "GET",
      })
        .done((data) => {
          const { readme } = data;
          this.readme = readme;
          resolve(null);
        })
        .fail((_error) => {
          reject(
            new Error(
              "There was an error loading the plugins infromation from NPM. Try in a few minutes and if the problem persists contact support.",
              { cause: { title: "Oups!" } }
            )
          );
        });
    });
  }
}
