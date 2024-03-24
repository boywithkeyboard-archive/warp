import { getBooleanInput, getInput, setFailed } from '@actions/core'
import { execSync } from 'node:child_process'
import { fetchTrace } from './fetchTrace'

try {
  async function action() {
    const onlyDoH = getBooleanInput('onlyDoH')
    const familyMode = getInput('familyMode')

    if (/^off|malware|full$/.test(familyMode) === false) {
      throw new Error('Bad option: familyMode')
    }

    // setup warp
    execSync('sudo apt-get -y update')
    execSync('sudo apt-get install -y cloudflare-warp')
    execSync('sudo warp-cli --accept-tos registration new')
    execSync(`sudo warp-cli --accept-tos mode ${onlyDoH ? 'doh' : 'warp+doh'}`)
    execSync(`sudo warp-cli --accept-tos set-families-mode ${familyMode}`)
    execSync('sudo warp-cli --accept-tos connect')

    // verify installation
    const trace = await fetchTrace()

    if (trace.warp === 'off') {
      throw new Error('WARP could NOT be enabled!')
    }

    console.log('WARP has been successfully activated!')
  }

  action()
} catch (err) {
  setFailed(
    err instanceof Error
      ? err.message
      : 'Something unexpected happened.'
  )
}
