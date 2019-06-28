export function debounce(func, wait = 20, immediate = true) {
  let timeout;
  console.log("in");
  return function () {
    console.log("debouncing");
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}