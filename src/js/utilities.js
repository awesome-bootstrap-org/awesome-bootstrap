/**
 * Make blink image from container
 * @param {jQuery HTML Element} container
 */
export function blinkImage(container) {
  setInterval(function () {
    $(container).find("img").toggleClass("invisible");
  }, 2000);
}

/**
 * Check if the Bootstrap version is deprecated
 * @param {String} version Bootstrap version to check
 * @returns {Boolean}
 */
export function isBootstrapDeprecated(version) {
  return ["1", "2", "3", "4"].includes(version);
}

/**
 * Set image root
 * @param {String} root Path to root
 */
export function setImageRoot(root) {
  $("img[data-src]").each((_index, image) => {
    $(image).attr("src", `${root}${$(image).attr("data-src")}`);
  });
}

/**
 * Config Showdown
 */
export function showdownConfig() {
  showdown.setOption("emoji", true);
  showdown.setOption("ghCodeBlocks", true);
  showdown.setOption("ghCompatibleHeaderId", true);
  showdown.setOption("simplifiedAutoLink", true);
  showdown.setOption("tables", true);
  showdown.setOption("tasklists", true);
}

/**
 * Convert Markdown to HTML
 * @param {String MD} markdown Markdown to convert to HTML
 * @returns {String HTML}
 */
export function md2html(markdown) {
  const converter = new showdown.Converter();
  return DOMPurify.sanitize(converter.makeHtml(markdown));
}
