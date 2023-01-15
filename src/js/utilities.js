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
