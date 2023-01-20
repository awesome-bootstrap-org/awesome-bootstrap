import { datediff, datediff2string, metric } from "./utilities.js";
export class Entry {
  static _timeout = 1500;
  static #endPoint = "/api/entries";
  /**
   * Create a new Entry
   * @param {Object} entry
   */
  constructor(entry) {
    this.title = entry.title;
    this.type = entry.type;
    this.source = entry.source;
    this.name = entry.name;
    this.author = entry.author;
    this.supports = entry.supports;
    this.keywords = entry.keywords;
    this.license = entry.license;
    this.description = entry.description;
    this.homepage = entry.homepage;
  }

  /**
   * Fetch Entry data from source
   * @returns {Promise}
   */
  load() {
    throw new Error("Interface not implemented.");
  }

  /**
   * Get all entries
   * @static
   * @param {String} root Path to root
   * @returns {Promise} on resolve an array of entries is send to callback
   */
  static all(root) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${root}${Entry.#endPoint}`,
        method: "GET",
      })
        .done((data) => {
          resolve(JSON.parse(data).map((entry) => new Entry(entry)));
        })
        .fail((_error) => {
          reject(
            new Error(
              "There was an error loading the plugins infromation. Try in a few minutes and if the problem persists contact support.",
              { cause: { title: "Oups!" } }
            )
          );
        });
    });
  }

  /**
   * Get entry by name
   * @static
   * @param {String} name Entry name to found
   * @param {String} root Path to root
   * @returns {Promise} on resolve an array of entries is send to callback
   */
  static get(name, root) {
    return new Promise((resolve, reject) => {
      Entry.all(root)
        .then((data) => {
          let filter = data.filter((entry) => entry.name === name);
          if (filter.length === 1) {
            resolve(filter[0]);
          } else if (filter.length > 1) {
            reject(
              new Error(`More than a plugin was found with name ${name}.`, {
                cause: { title: "Oups!" },
              })
            );
          } else {
            reject(
              new Error(`Any plugin found with name ${name}.`, {
                cause: { title: "Oups!" },
              })
            );
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Check if the entry match filter options
   * @param {Map} filterOptions Filter options
   * @returns {Boolean}
   */
  match(filterOptions) {
    if (
      this.supports.includes(filterOptions.get("support")) &&
      (filterOptions.get("type") === "all" ||
        filterOptions.get("type") === this.type)
    ) {
      if (filterOptions.get("search")) {
        const regexp = new RegExp(
          filterOptions.get("search").trim().replace(/ /g, "|"),
          "i"
        );
        return (
          regexp.test(this.description) ||
          regexp.test(this.name) ||
          regexp.test(this.keywords.join(""))
        );
      } else {
        return true;
      }
    }
    return false;
  }

  /**
   * Rende entry card
   * @param {String} root Path to root
   * @returns {jQuery HTML Element}
   */
  renderCard(root) {
    return $('<div class="card h-100"></div>').append(
      $('<h3 class="card-header"></h3>').text(this.title),
      $('<div class="card-body"></div>').append(
        this.renderHeaderBadges(root),
        $(`<span>${this.description}</span>`),
        $("<div></div>")
          .addClass("d-flex align-items-center justify-content-end")
          .append(this.renderDetailLink(root))
      ),
      $('<div class="card-footer"></div>').append(this.renderKeywords())
    );
  }

  /**
   * Render entry header badges
   * @param {String} root Path to root
   * @returns {jQuery HTML Element}
   */
  renderHeaderBadges(root) {
    const container = $("<div></div>").addClass(
      "d-flex align-items-center flex-wrap"
    );
    if (this.lastRelease?.tag) {
      container.append(this.renderLastReleaseTag());
    }
    if (this.lastRelease?.timestamp) {
      container.append(this.renderLastReleaseTime());
    }
    container.append(
      this.renderLicense(),
      this.renderAuthor(),
      this.renderHomepage()
    );
    if (this.package) {
      container.append(this.renderPackage());
    }
    if (this.cdn) {
      container.append(this.renderCDN());
    }
    if (this.quality) {
      container.append(this.renderQuality());
    }
    if (this.vulnerabilities) {
      container.append(this.renderVulnerabilities());
    }

    return container;
  }

  /**
   * Render entry keywords
   * @returns {jQuery HTML Element}
   */
  renderKeywords() {
    return this.#renderAttribute("Keywords", "tags", this.keywords.join(" "));
  }

  /**
   * Render entry author
   * @returns {jQuery HTML Element}
   */
  renderAuthor() {
    return this.#renderAttribute(
      "Autor",
      "people",
      typeof this.author === "object"
        ? `<a href="${this.author.url}" target="_blank" rel="external noopener noreferrer" title="${this.author.name}">${this.author.name}</a>`
        : this.author
    );
  }

  /**
   * Render entry license
   * @returns {jQuery HTML Element}
   */
  renderLicense() {
    return this.#renderAttribute(
      "License",
      this.license === "CUSTOM" ? "patch-exclamation" : "patch-check",
      this.license
    );
  }

  /**
   * Render entry homepage
   * @returns {jQuery HTML Element}
   */
  renderHomepage() {
    return this.#renderAttribute(
      "Website",
      "link-45deg",
      `<a href="${this.homepage}" target="_blank" rel="external noopener noreferrer" title="${this.name}">Website</a>`
    );
  }

  /**
   * Render entry quality
   * @returns {jQuery HTML Element}
   */
  renderQuality() {
    return this.#renderAttribute(
      "Quality",
      "check2-circle",
      `${this.quality || "Unknown"}`
    );
  }

  /**
   * Render entry last release tag
   * @returns {jQuery HTML Element}
   */
  renderLastReleaseTag() {
    return this.#renderAttribute(
      "Last release tag",
      "tag",
      `${this.lastRelease?.tag || "Unknown"}`
    );
  }

  /**
   * Render entry last release time
   * @returns {jQuery HTML Element}
   */
  renderLastReleaseTime() {
    return this.#renderAttribute(
      "Published last release",
      "calendar",
      `${datediff2string(datediff(this.lastRelease?.timestamp)) || ""}`
    );
  }

  /**
   * Render entry PAckage
   * @returns {jQuery HTML Element}
   */
  renderPackage() {
    let text;
    if (this.package?.url && this.package?.downloads) {
      text = `<a href="${this.package.url}" title="${
        this.package?.name || this.source
      } for ${this.title}" target="_blank">${metric(
        this.package.downloads
      )} downloads/month</a>`;
    } else if (this.package?.downloads) {
      text = `${metric(this.package.downloads)} downloads/month`;
    } else if (this.package?.url) {
      text = `<a href="${this.package.url}" title="${
        this.package?.name || this.source
      } for ${this.title}" target="_blank">See ${
        this.package?.name || this.source
      }</a>`;
    }
    return this.#renderAttribute(
      this.package?.name || this.source,
      "download",
      `${text || "Unknown"}`
    );
  }

  /**
   * Render entry CDN
   * @returns {jQuery HTML Element}
   */
  renderCDN() {
    let text;
    if (this.cdn?.url && this.cdn?.hits) {
      text = `<a href="${this.cdn.url}" title="CDN for ${
        this.title
      }" target="_blank">${metric(this.cdn.hits)} hits/month</a>`;
    } else if (this.cdn?.hits) {
      text = `${metric(this.cdn.hits)} hits/month`;
    } else if (this.cdn?.url) {
      text = `<a href="${this.cdn.url}" title="CDN for ${this.title}" target="_blank">See CDN</a>`;
    }
    return this.#renderAttribute("CDN", "download", `${text || "Unknown"}`);
  }

  /**
   * Render entry vulnerabilities
   * @returns {jQuery HTML Element}
   */
  renderVulnerabilities() {
    return this.#renderAttribute(
      "Vulnerabilities",
      "exclamation-square",
      `<a href="${
        this.vulnerabilities?.url || "#"
      }" title="Vulnerabilities for ${this.title}" target="_blank">${
        this.vulnerabilities?.count || "Unknown"
      }</a>`
    );
  }

  /**
   * Render entry detail link
   * @param {String} root Path to root
   * @returns {jQuery HTML Element}
   */
  renderDetailLink(root) {
    return this.#renderAttribute(
      "Details",
      "file-text",
      `<a href="${root}/detail?name=${this.name}" title="Detail ${this.title}">See more</a>`
    );
  }

  /**
   * Render an entry attribute
   * @private
   * @param {String} attribute Title for the icon
   * @param {String} icon Icon from bootstrap icon
   * @param {String HTML} value String or HTML to display
   * @returns {jQuery HTML Element}
   */
  #renderAttribute(attribute, icon, value) {
    return $('<div class="d-flex text-muted pe-4"></div>').append(
      $(
        `<i class="bi bi-${icon} flex-grow-0 flex-shrink-0 align-self-center pe-2" aria-hidden="true" title="${attribute}"></i>`
      ),
      $('<span class="fw-light"></span>').html(value)
    );
  }
}
