import { groupBy } from "lodash"

export const UNIQUE_TOKENS_LIMIT_PER_PAGE = 50
export const UNIQUE_TOKENS_LIMIT_TOTAL = 2000

export const fetchOpenseaContent = async (address, page = 0) => {
  try {
    const offset = page * UNIQUE_TOKENS_LIMIT_PER_PAGE
    const url = `https://api.opensea.io/api/v1/assets?owner=${address}&limit=${UNIQUE_TOKENS_LIMIT_PER_PAGE}&offset=${offset}`
    const data = await fetch(url).then((res: Response) => res.json())

    if (data?.assets) {
      return groupBy(data.assets, "collection.name")
    } else {
      return []
    }
  } catch (error) {
    console.error("## Error fetchOpenseaContent:", error)
    throw error
  }
}
