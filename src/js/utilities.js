/**
 * Make blink image from container
 * @param {jQuery HTML Element} container 
 */
export function blinkImage(container) {
    setInterval(function () {
        $(container).find('img').toggleClass("invisible");
    }, 2000);
}