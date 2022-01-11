import { validate } from "@ensdomains/ens-validation"

export const trim = (input: string): string | null => {
  const trimmed = input.toLowerCase().trim()
  if (trimmed.endsWith(".eth") && validate(trimmed)) {
    return trimmed
  } else {
    return null
  }
}
