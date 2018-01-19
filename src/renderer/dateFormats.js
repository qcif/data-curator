const supportedFormats = {
  '%d/%m/%y': 'date',
  '%d/%m/%Y': 'date',
  '%H:%M': 'time'
}

export function isValidPatternForType(pattern, type) {
  let matchFound = false
  for (const [nextPattern, nextType] of Object.entries(supportedFormats)) {
    if (pattern === nextPattern && type === nextType) {
      matchFound = true
      break
    }
  }
  return matchFound
}
