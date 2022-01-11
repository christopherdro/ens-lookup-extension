import { browser } from "webextension-polyfill-ts"

browser.runtime.onInstalled.addListener((): void => {
  console.log("extension installed")
})

browser.runtime.onConnect.addListener((): void => {
  console.log("connected")
})
