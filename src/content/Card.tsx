import React, { useState } from "react"
import { AnimateSharedLayout, motion } from "framer-motion"
import EnsProvider from "./EnsProvider"
import { useQuery } from "@apollo/client"
import { ENS_SUGGESTIONS } from "../utils/queries"
import { Props } from "framer-motion/types/types"

type Card = {
  anchor: { x: number; y: number }
  trigger: string | null
  onClose: () => void
}

function Card({ anchor, trigger, onClose }: Props) {
  const [open, setOpen] = useState(false)
  const { data, loading } = useQuery(ENS_SUGGESTIONS, {
    variables: { name: trigger },
  })

  const valid = data?.domains[0]
  return (
    <AnimateSharedLayout>
      {open ? (
        <motion.div id="expanded-card" className="expanded-card" layoutId="expandable-card">
          {anchor && <EnsProvider data={data} name={trigger} />}
          <div
            style={{ position: "fixed", top: 20, right: 20, cursor: "pointer", fontSize: "2em" }}
            onClick={() => {
              setOpen(false)
              onClose()
            }}
          >
            ❌
          </div>
        </motion.div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: anchor.y,
            left: anchor.x,
            zIndex: 99999999,
            cursor: valid ? "pointer" : "default",
          }}
        >
          <motion.div
            onClick={() => valid && setOpen(true)}
            className="normal-card"
            id="normal-card"
            layoutId="expandable-card"
          >
            {loading ? (
              <span>Loading...</span>
            ) : valid ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span>✅&nbsp;{trigger}</span>
                <span>
                  <small>(click to expand)</small>
                </span>
              </div>
            ) : (
              <span>❌&nbsp;{trigger} not registered</span>
            )}
          </motion.div>
        </div>
      )}
    </AnimateSharedLayout>
  )
}
export default Card
