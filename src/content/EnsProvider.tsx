import React, { useCallback, useEffect, useState } from "react"
import EnsRecord from "./EnsRecord"

import { arrayify } from "@ethersproject/bytes"
import { Contract } from "@ethersproject/contracts"
import { fetchOpenseaContent } from "../utils/opensea"
import { formatsByCoinType } from "@ensdomains/address-encoder"
import { getDefaultProvider } from "@ethersproject/providers"
import { namehash } from "@ethersproject/hash"

const ENS_CONTRACT = "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41"
const provider = getDefaultProvider()
const contract = new Contract(
  ENS_CONTRACT,
  [
    "function addr(bytes32,uint256) view returns (bytes)",
    "function text(bytes32,string) view returns (string)",
    "function contenthash(bytes32) view returns (bytes)",
  ],
  provider
)

const EnsProvider = ({ name, data }) => {
  const [content, setContent] = useState(null)

  const getTextRecords = useCallback(async () => {
    if (data?.domains?.[0]) {
      const { domains } = data
      const { resolvedAddress: address, resolver, owner } = domains?.[0]
      const providerResolver = await provider.getResolver(name)

      let dataTest = {
        owner: null,
        address: null,
        contentHash: null,
        avatar: null,
        domain: name,
        textRecords: [],
        wallets: [],
        nft: [],
      }
      if (owner) dataTest.owner = owner.id
      if (address) dataTest.address = address.id

      if (providerResolver) {
        // Use built-in ENS resolver to fetch avatar to make us of of parsing logic
        // https://github.com/ethers-io/ethers.js/blob/28f383300c0d79b9de2dc0c52a7ef335f3e28d33/packages/providers/src.ts/base-provider.ts#L409-L512
        dataTest.avatar = await providerResolver.getAvatar()

        // Get Content
        dataTest.contentHash = await contract.contenthash(namehash(name))

        // Get Coin Addresses
        if (resolver?.coinTypes) {
          const promises = resolver.coinTypes.map((coinType) => {
            return new Promise(async (resolve, reject) => {
              try {
                const hexAddress = await contract["addr(bytes32,uint256)"](namehash(name), coinType)
                const coin = formatsByCoinType[coinType].name
                const address = formatsByCoinType[coinType].encoder(
                  Buffer.from(arrayify(hexAddress))
                )
                resolve({ coin, address })
              } catch (err) {
                reject(err)
              }
            })
          })
          dataTest.wallets = await Promise.all(promises)
        }

        // Get Text Records
        if (resolver?.texts) {
          const promises = resolver.texts.map((record) => {
            return new Promise(async (resolve, reject) => {
              try {
                const text = await contract.text(namehash(name), record)
                resolve({ record, text })
              } catch (err) {
                reject(err)
              }
            })
          })

          dataTest.textRecords = await Promise.all(promises)
        }
      }

      // Fetch NFTs from Opensea
      const nft = await fetchOpenseaContent(dataTest.owner)
      dataTest.nft = nft

      console.log("## Setting payload: ", dataTest)
      setContent(dataTest)
    }
  }, [data, name])

  useEffect(() => {
    getTextRecords()
  }, [getTextRecords, name])

  return content ? <EnsRecord content={content} /> : <h1>Fetching records ...</h1>
}

export default EnsProvider
