import { blinkImage } from "./utilities.js";
import { HomePage } from "./HomePage.js";

/**
 * Main function
 */
$().ready(function () {
  // Init
  const _homepage = new HomePage();

  // Blinking logo
  $(".img-toggle").each((_index, container) => blinkImage(container));
});
