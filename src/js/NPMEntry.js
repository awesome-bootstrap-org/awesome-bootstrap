import { Entry } from "./Entry.js";

export class NPMEntry extends Entry {
  static #npmEndpoint = "https://registry.npmjs.org/";
  static #packageQualityEndpoint = "https://packagequality.com/package/";
  static #jsDelivrEndpoint = "https://data.jsdelivr.com/v1/package/npm/";
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
          this.name = DOMPurify.sanitize(name);
          this.homepage = DOMPurify.sanitize(homepage);
          this.lastRelease = {
            tag: DOMPurify.sanitize(data["dist-tags"]?.latest),
          };
          if (this.lastRelease.tag && data.time) {
            this.lastRelease.timestamp = DOMPurify.sanitize(
              data.time[this.lastRelease.tag]
            );
          }

          Promise.all([this.fetchQuality(), this.fetchCDN()])
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
          this.quality = DOMPurify.sanitize(quality);
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

  /**
   * Fetch CDN form jsDelivr
   * @returns {Promise}
   */
  fetchCDN() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${NPMEntry.#jsDelivrEndpoint}${this.name}/stats/date/month`,
        method: "GET",
      })
        .done((data) => {
          const { total } = data;
          this.cdn = {
            hits: DOMPurify.sanitize(total),
            url: `https://www.jsdelivr.com/package/npm/${this.name}`,
          };
          resolve();
        })
        .fail((_error) => {
          reject(
            new Error(
              "There was an error loading the plugins information from jsDelivr.",
              { cause: { title: "Oups!" } }
            )
          );
        });
    });
  }
}
