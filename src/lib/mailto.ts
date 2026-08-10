export function buildContactMailto({
  name,
  message,
}: {
  name: string
  message: string
}): string {
  const subject = `LuisExpert.dev message from ${name}`
  const body = `${message}\n\n— ${name}`
  return `mailto:hello@luisexpert.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
