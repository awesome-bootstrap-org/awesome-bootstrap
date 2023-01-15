import { setImageRoot, blinkImage } from "./utilities.js";
export class Page {
  /**
   * Create a new Page and init component
   */
  constructor() {
    setImageRoot(this.root);
    $(".img-toggle").each((_index, container) => blinkImage(container));
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
}
