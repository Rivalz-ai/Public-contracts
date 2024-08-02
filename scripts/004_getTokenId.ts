import { getTokenId } from './utils'

getTokenId().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
