import { registerCanonicalToken } from './utils'

registerCanonicalToken().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
