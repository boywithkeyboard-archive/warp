import { getBooleanInput, getInput, setFailed } from '@actions/core'
import { execSync } from 'node:child_process'
import { fetchTrace } from './fetchTrace'
import { wait } from './wait'

try {
  async function action() {
    const onlyDoH = getBooleanInput('onlyDoH')
    const familyMode = getInput('familyMode')

    if (/^off|malware|full$/.test(familyMode) === false) {
      throw new Error('Bad option: familyMode')
    }

    // add cloudflare gpg key
    execSync('curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg')

    // add repo to apt repos
    execSync('echo "deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflare-client.list')

    // install warp
    execSync('sudo apt-get -y update && sudo apt-get install -y cloudflare-warp')

    // setup warp
    execSync('sudo warp-cli --accept-tos registration new')
    execSync(`sudo warp-cli --accept-tos mode ${onlyDoH ? 'doh' : 'warp+doh'}`)
    execSync(`sudo warp-cli --accept-tos dns families ${familyMode}`)
    execSync('sudo warp-cli --accept-tos connect')

    // verify installation
    await wait(1000)

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
