import { ApolloProvider } from "@apollo/client"
import React, { useCallback, useEffect, useState } from "react"
import { ensClient } from "../apollo/client"
import { debounce } from "../utils/select"
import { trim } from "../utils/string"
import Card from "./Card"
import "./styles.scss"

const App = () => {
  const [anchor, setAnchor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [trigger, setTrigger] = useState<string | null>(null)

  const triggerSelectionEnd = useCallback(() => {
    // Ignore mouse over events if a record currently being shown
    if (trigger || document.getElementsByClassName("ens-record").length) return

    let text = ""
    const selection = window.getSelection()
    if (selection) {
      text = selection.toString()
      const range = selection.getRangeAt(0)
      const bounds = range.getBoundingClientRect()
      const x = bounds.left + window.scrollX + 20
      const y = bounds.top + window.scrollY + 20
      setAnchor({ x, y })
    }
    const value = trim(text)
    if (value) {
      setTrigger(value)
      const element = document.getElementById("normal-card")
      element.addEventListener("mouseover", () => setIsHovering(true))
      element.addEventListener("mouseleave", () => setIsHovering(false))
    } else {
      if (!isHovering && !document.getElementById("expanded-card")) {
        setTrigger(null)
      }
    }
  }, [isHovering, trigger])

  useEffect(() => {
    // Listen selection change every 700 ms. It covers keyboard selection and selection from menu (select all option)
    document.addEventListener("selectionchange", debounce(triggerSelectionEnd, 700))
    return () => document.removeEventListener("selectionchange", debounce(triggerSelectionEnd, 700))
  }, [triggerSelectionEnd])

  return (
    <ApolloProvider client={ensClient}>
      {trigger && <Card anchor={anchor} trigger={trigger} onClose={() => setTrigger(null)} />}
    </ApolloProvider>
  )
}

export default App
