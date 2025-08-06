{{ if site.Params.modules.hanko.endpoint -}}
import { register } from '/js/hanko-elements.min.mjs'

const { hanko } = await register('{{ site.Params.modules.hanko.endpoint }}')

const logoutLink = document.getElementById('logout-link')
if (logoutLink !== null) {
  logoutLink.addEventListener('click', (event) => {
    event.preventDefault()
    hanko.user.logout()
  })
}

hanko.onSessionCreated(() => {
  // successfully logged in, redirect to a page in your application
  document.location.href = '{{ index site.Params.modules.hanko "login-redirect" }}'
})

hanko.onUserLoggedOut(() => {
  // successfully logged out, redirect to a page in your application
  document.location.href = '{{ index site.Params.modules.hanko "logout-redirect" }}'
})

{{ else }}
    {{- errorf "module [hanko] - expected endpoint: %s" "site.Params.modules.hanko.endpoint" -}}
{{ end }}