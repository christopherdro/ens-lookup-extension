import * as React from "react"
import { browser, Tabs } from "webextension-polyfill-ts"

import "./styles.scss"

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url })
}

const Popup: React.FC = () => {
  return (
    <section id="popup">
      <h2>ENS Lookup Extension</h2>

      <div className="links__holder">
        <ul>
          <li>
            <button
              type="button"
              onClick={(): Promise<Tabs.Tab> => {
                return openWebPage("https://github.com/christopherdro/ens-lookup-extension")
              }}
            >
              GitHub
            </button>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Popup
