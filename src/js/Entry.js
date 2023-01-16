export class Entry {
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
          filterOptions.get("search").trim().replace(" ", "|"),
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
        $("<div></div>")
          .addClass("d-flex align-items-center flex-wrap")
          .append(
            this.renderAuthor(),
            this.renderHomepage(),
            this.renderLicense()
          ),
        $(`<span>${this.description}</span>`),
        $("<div></div>")
          .addClass("d-flex align-items-center justify-content-end")
          .append(this.renderDetailLink(root))
      ),
      $('<div class="card-footer"></div>').append(this.renderKeywords())
    );
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