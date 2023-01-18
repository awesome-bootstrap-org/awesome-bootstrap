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

/**
 * Given a number (positive or negative), string with appropriate unit in the metric system, SI.
 * @author Badges Shields Contributors
 * @license CC0-1.0
 * @param {Number} n Number to format
 * @returns {String}
 */
export function metric(n) {
  const metricPrefix = ["k", "M", "G", "T", "P", "E", "Z", "Y"];
  const metricPower = metricPrefix.map((a, i) => Math.pow(1000, i + 1));
  for (let i = metricPrefix.length - 1; i >= 0; i--) {
    const limit = metricPower[i];
    const absN = Math.abs(n);
    if (absN >= limit) {
      const scaledN = absN / limit;
      if (scaledN < 10) {
        const oneDecimalN = scaledN.toFixed(1);
        if (oneDecimalN.charAt(oneDecimalN.length - 1) !== "0") {
          const res = `${oneDecimalN}${metricPrefix[i]}`;
          return n > 0 ? res : `-${res}`;
        }
      }
      const roundedN = Math.round(scaledN);
      if (roundedN < 1000) {
        const res = `${roundedN}${metricPrefix[i]}`;
        return n > 0 ? res : `-${res}`;
      } else {
        const res = `1${metricPrefix[i + 1]}`;
        return n > 0 ? res : `-${res}`;
      }
    }
  }
  return `${n}`;
}
