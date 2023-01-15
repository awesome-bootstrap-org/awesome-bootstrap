import {
  setImageRoot,
  blinkImage,
  showdownConfig,
  md2html,
} from "./utilities.js";
export class Page {
  /**
   * Create a new Page and init component
   */
  constructor() {
    setImageRoot(this.root);
    $(".img-toggle").each((_index, container) => blinkImage(container));
    showdownConfig();
  }

  /**
   * Render an alert
   * @static
   * @param {String | HTML} text alert body
   * @param {String} style alert style
   * @param {String | HTML} heading alert heading text (default: undefined)
   * @param {boolean} isClosable alert closable (default: true)
   * @returns {jQuery HTML Element} alert
   */
  static renderAlert(
    text,
    style = "danger",
    heading = undefined,
    isClosable = true
  ) {
    let $alert = $('<div class="alert" role="alert"></div>')
      .addClass(`alert-${style}`)
      .append($('<div class="alert-body"></div>').html(text));
    if (heading) {
      $alert.prepend($('<h4 class="alert-heading"></h4>').html(heading));
    }
    if (isClosable) {
      $alert
        .addClass("alert-dismissible fade show")
        .append(
          $(
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
          )
        );
    }
    return $alert;
  }

  /**
   * Get the path to root
   * @returns {String} path to root
   */
  get root() {
    return undefined;
  }

  /**
   * Convert and format Markdown to HTML
   * @static
   * @param {String MD} markdown Markdown to convert to HTML
   * @param {jQuery HTML Element} container Element to append markdown
   */
  static appendMD(markdown, container) {
    container.append($(md2html(markdown)));
    container.find("table").addClass("table table-striped w-100");
    container.find("img").addClass("mw-100");
    container
      .find("pre code.ksh")
      .removeClass("ksh language-ksh")
      .addClass("sh language-sh");
    hljs.highlightAll();
  }
}
