{{ if site.Params.modules.hanko.endpoint -}}
import { register } from '/js/hanko-elements.min.mjs'

const { hanko } = await register('{{ site.Params.modules.hanko.endpoint }}')

function createFragment(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

const modalExpired = `
    <dialog id="timeout-modal" class="hanko-dialog py-4">
      <form method="dialog">
          <div class="modal-content">
              <div class="modal-body p-2">
                  {{ T "ui_expired" }}
              </div>
              <div class="modal-footer">
                <button id="login-link" type="submit" class="btn btn-primary mx-auto mt-4">Login</button>
              </div>
          </div>
      </form>
    </dialog>`

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

hanko.onSessionExpired(() => {
  // session expired, show a modal message with redirect button
    if (document.getElementById("timeout-modal") == null) {
      const fragment = createFragment(modalExpired)
      document.body.insertBefore(fragment, document.body.childNodes[0])
    }

    const dialog = document.getElementById("timeout-modal")
    const loginLink = document.getElementById('login-link')
    if ((dialog !== null) && (loginLink !== null)) {
    
      loginLink.addEventListener('click', (event) => {
        event.preventDefault()
        document.location.href = '{{ index site.Params.modules.hanko "timeout-redirect" }}'
      })
    
      dialog.showModal()
    }
})

hanko.onUserLoggedOut(() => {
  // successfully logged out, redirect to a page in your application
  document.location.href = '{{ index site.Params.modules.hanko "logout-redirect" }}'
})

{{ else }}
    {{- errorf "module [hanko] - expected endpoint: %s" "site.Params.modules.hanko.endpoint" -}}
{{ end }}