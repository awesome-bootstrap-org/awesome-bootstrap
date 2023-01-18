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
          const { readme, name, homepage } = data;
          this.readme = readme;
          this.name = name;
          this.homepage = homepage;
          this.lastRelease = data["dist-tags"]?.latest;

          Promise.all([this.fetchQuality()])
            .catch(() => {})
            .finally(() => {
              resolve();
            });
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

  /**
   * Fetch package quality form Package Quality
   * @returns {Promise}
   */
  fetchQuality() {
    return new Promise((resolve, reject) => {
      /*$.ajax({
        url: `${NPMEntry.#packageQualityEndpoint}${this.name}`,
        method: "GET",
      })
        .done((data) => {
          const { quality } = data;
          this.quality = quality;
          resolve();
        })
        .fail((_error) => {
          reject(
            new Error(
              "There was an error loading the plugins information from Package Quality.",
              { cause: { title: "Oups!" } }
            )
          );
        });*/ resolve(); // WAITING FIX https://github.com/alexfernandez/package-quality/issues/45
    });
  }
}
