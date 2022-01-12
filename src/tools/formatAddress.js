export default function formatAddress(str) {
  if (!str || !str.length) return ''
  const len = str.length
  return str.slice(0, 5) + '...' + str.slice(len - 3, len)
}
