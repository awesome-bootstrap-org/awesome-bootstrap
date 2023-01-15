export class Entrie {
  static #endPoint = "/api/entries";
  /**
   * Create a new Entrie
   * @param {Object} entrie
   */
  constructor(entrie) {
    this.type = entrie.type;
    this.source = entrie.source;
    this.name = entrie.name;
    this.author = entrie.author;
    this.supports = entrie.supports;
    this.keywords = entrie.keywords;
    this.license = entrie.license;
    this.description = entrie.description;
    this.homepage = entrie.homepage;
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
        url: `${root}${Entrie.#endPoint}`,
        method: "GET",
      })
        .done((data) => {
          resolve(JSON.parse(data).map((entrie) => new Entrie(entrie)));
        })
        .fail((error) => {
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
   * Rende entrie card
   * @returns {jQuery HTML Element}
   */
  renderCard() {
    return $('<div class="card h-100"></div>').append(
      $('<h3 class="card-header"></h3>').text(this.name),
      $('<div class="card-body"></div>').append(
        $('<div class="d-flex align-items-center flex-wrap"></div>').append(
          this.renderAuthor(),
          this.renderHomepage(),
          this.renderLicense()
        ),
        $(`<span>${this.description}</span>`)
      ),
      $('<div class="card-footer"></div>').append(this.renderKeywords())
    );
  }

  /**
   * Render entrie keywords
   * @returns {jQuery HTML Element}
   */
  renderKeywords() {
    return this.#renderAttribute("tags", "tags", this.keywords.join(" "));
  }

  /**
   * Render entrie author
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
   * Render entrie license
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
   * Render entrie homepage
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
   * Render an entrie attribute
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
