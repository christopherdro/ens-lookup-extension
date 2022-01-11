// Returns a function, that, as long as it continues to be invoked, will not be triggered.
// The function will be called after it stops being called for N milliseconds.
export function debounce(callback, interval = 300) {
  let debounceTimeoutId
  return function (...args) {
    clearTimeout(debounceTimeoutId)
    debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval)
  }
}
