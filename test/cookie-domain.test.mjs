// Proves the `cookie-domain` applicability guard in hanko.mjs.
//
// The guard decides whether the parent-domain cookie option is handed to the
// SDK, and both of its failure directions are silent: too permissive and the
// browser rejects the cookie so sign-in never sticks, too strict and the shared
// session quietly degrades to a per-host one. Neither raises an error, so the
// logic is pinned here rather than left to a browser to discover.
//
// The guard is lifted out of the shipped hanko.mjs rather than retyped, so
// editing that file is what makes this test fail.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, '..', 'assets', 'js', 'modules', 'hanko', 'hanko.mjs')
const src = readFileSync(source, 'utf8')

const block = src.match(/const cookieDomain = '\{\{ \$cookieDomain \}\}'[\s\S]*?^\)$/m)
if (!block) {
  console.error(`FAIL: guard block not found in ${source} — its shape changed`)
  process.exit(2)
}

// Bind the Hugo placeholder to a literal and stub `location`, then evaluate the
// real statements.
function applies (declared, hostname) {
  const body = block[0].replace("'{{ $cookieDomain }}'", JSON.stringify(declared))
  return new Function('location', `${body}\nreturn cookieDomainApplies`)({ hostname })
}

// Hostnames use the RFC 2606 reserved domains, which exist for exactly this.
const cases = [
  // Inside the declared domain: the shared cookie is the whole point.
  ['.example.com', 'app.example.com', true],
  ['.example.com', 'docs.example.com', true],
  ['.example.com', 'example.com', true],
  ['.example.com', 'a.b.example.com', true],
  // Outside it: the browser would reject a Domain it is not within, so the
  // option must be withheld and the cookie left host-only. localhost is the
  // case that keeps one built site usable in local development.
  ['.example.com', 'localhost', false],
  ['.example.com', '127.0.0.1', false],
  ['.example.com', 'preview-abc.example.net', false],
  // Suffix confusion: endsWith without a separating dot would match these.
  ['.example.com', 'evilexample.com', false],
  ['.example.com', 'notexample.com', false],
  // A bare domain behaves identically — RFC 6265 ignores the leading dot.
  ['example.com', 'app.example.com', true],
  ['example.com', 'evilexample.com', false],
  // Unset must never apply, for any host. The SDK tests the option against
  // `undefined`, so an empty string would reach the cookie as an empty Domain
  // attribute instead of being omitted. The trailing-dot FQDN is the host that
  // slips through if the non-empty clause is dropped.
  ['', 'app.example.com', false],
  ['', 'localhost', false],
  ['', 'example.com.', false]
]

let failed = 0
for (const [declared, hostname, want] of cases) {
  const got = applies(declared, hostname)
  if (got !== want) {
    failed++
    console.error(`FAIL  cookie-domain=${JSON.stringify(declared)} host=${hostname} got=${got} want=${want}`)
  }
}

if (failed > 0) {
  console.error(`\ncookie-domain guard: ${failed} of ${cases.length} cases failed`)
  process.exit(1)
}
console.log(`cookie-domain guard: ${cases.length} cases passed`)
