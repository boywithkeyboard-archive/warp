export async function fetchTrace() {
  const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace')

  const str = await res.text()

  const arr = str.split('\n').filter(item => item.length > 0)

  const obj: Record<string, any> = {}

  for (let i = 0; i < arr.length; i++) {
    obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
  }

  return obj
}
