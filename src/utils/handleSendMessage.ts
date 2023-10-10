import type { Contact } from "@/types/row";
import Swal from "sweetalert2";
import { sendWhatsAppMessage } from "./whatsApp";

const okEmoji = "✅"
const errorEmoji = "🔴"
function generateTableHTML(contacts: Contact[]): string {
    let html = '<table class="send-message-table">';

    // Generate tbody
    html += '<tbody>';
    for (const contact of contacts) {
        html += `<tr style="text-align:left" class="contact-send-status">`;
        for (const property of ['nombre', 'numero']) {
            html += `<td>${contact[property]}</td>`;
        }
        html += `<td id="status-${contact.id}"></td>`;
        html += '</tr>';
    }
    html += '</tbody>';

    html += '</table>';

    return html;
}

const setupWhatsappVariables =  (contacts: Contact[], message: string): any => Swal.fire({
    title: 'Ingrese sus datos de Whatsapp Business ',
    html: `
<div>
<div style="display:flex" class="align-center">
<span>Whatsapp Phone Id</span>
<button id="infoBtnPhoneId" style="background-color: #007BFF; color: #FFF; border-radius: 50%; padding: 5px 10px; border: none; cursor: pointer; margin-left: 5px;">i</button>
<input type="text" id="input1" class="swal2-input" placeholder="First Input">
</div>
<div style="display:flex" class="align-center">
<span>Whatsapp Token</span>
<button id="infoBtnToken" style="background-color: #007BFF; color: #FFF; border-radius: 50%; padding: 5px 10px; border: none; cursor: pointer; margin-left: 5px;">i</button>
<input type="text" id="input2" class="swal2-input" placeholder="Second Input">
</div>


</div>
`,
    focusConfirm: false,
    didOpen: () => {
        document.getElementById('infoBtnPhoneId')?.addEventListener('click', () => {
            Swal.fire({
                title: 'Crear una Aplicación en Facebook Developers',
                html: `<ul>
  <li><strong>Paso 1: Creá una Aplicación en Facebook Developers</strong>
    <ul>
      <li class="align-left">Ingresá a <a href="https://developers.facebook.com/apps" target="_blank">developers.facebook.com/apps</a>.</li>
      <li class="align-left">Hacé clic en el botón “<em>Crear App</em>”.</li>
      <li class="align-left">Seleccioná “<em>Para Todo en Facebook</em>” y después “<em>Continuar</em>”.</li>
      <li class="align-left">Completá la información requerida, como el nombre de la app, correo electrónico de contacto y propósito de la app, y luego hacé clic en “<em>Crear ID de App</em>”.</li>
    </ul>
  </li>
    <br/>
  <li><strong>Paso 2: Configurá WhatsApp en la Aplicación</strong>
    <ul>
      <li class="align-left">Una vez creada la app, en el panel lateral izquierdo, buscá y seleccioná “<em>WhatsApp</em>”.</li>
      <li class="align-left">Seguí las instrucciones para configurar WhatsApp con tu app.</li>
    </ul>
  </li>
    <br/>
  <li><strong>Paso 3: Obtené el ID del Número de Teléfono</strong>
    <ul>
      <li class="align-left">Dentro de la sección de “<em>WhatsApp</em>”, hacé clic en “<em>Configuración de API</em>”.</li>
      <li class="align-left">En esta sección, podrás ver el ID del número de teléfono. Anotalo o copialo para tus futuras referencias.</li>
    </ul>
  </li>
</ul>`,
                icon: 'info'
            })
            .then(result => {
                    if (result.isConfirmed) {
                        return setupWhatsappVariables(contacts, message)
                    }
                })
        })
        document.getElementById('infoBtnToken')?.addEventListener('click', () => {
            Swal.fire({
                title: 'Crear un Token Permanente para WhatsApp Business',
                html: `<ul>
<li><b>Para crear un token permanente tuviste que ya haber creado una aplicación en Facebook Developers.</b></li>
<br/>
<li>
<b>Paso 1: Accedé a la Configuración de Negocio</b>
<ol>
<li class="align-left">Iniciá sesión en tu cuenta de <a href="https://business.facebook.com/">Facebook Business</a>.</li>
<li class="align-left">Abrí el menú lateral de usuario de arriba a la izquierda. Tocá la ruedita de configuración de tu cuenta comercial y después andá a <b>“Configuración de Negocio”</b>.</li>
</ol>
</li>
    <br/>
<li>
<b>Paso 2: Creá un Usuario del Sistema</b>
<ol>
<li class="align-left">En la barra lateral izquierda, buscá y seleccioná <b>"Usuarios"</b> y luego <b>“Usuarios del Sistema”</b>.</li>
<li class="align-left">Hacé clic en <b>“Agregar”</b>.</li>
<li class="align-left">Seleccioná <b>“Administrador”</b> como el rol.</li>
<li class="align-left">Ingresá el nombre para el nuevo usuario del sistema y confirmá la creación.</li>
</ol>
</li>
    <br/>
<li>
<b>Paso 3: Asigná la Aplicación de WhatsApp Business al Usuario del Sistema</b>
<ol>
<li class="align-left">Una vez creado el usuario del sistema, hacé clic en <b>"Agregar Activos" en el lado derecho</b>.</li>
<li class="align-left">Buscá la sección <b>“Apps”</b> y buscá y seleccioná la aplicación de <b>WhatsApp Business</b>. En la sección <b>Control Total</b> activá la opción <b>"Administrar app"</b></li>
<li class="align-left">Hacé clic en <b>“Guardar Cambios”</b>.</li>
</ol>
</li>
    <br/>
<li>
<b>Paso 4: Generá el Token Permanente</b>
<ol>
<li class="align-left">Aún en la sección Usuarios del sistema, hacé click en <b>"Generar nuevo token"</b>.</li>
<li class="align-left">Seleccioná tu aplicación de <b>WhatsApp Business</b> y activá la opción "Nunca" para el tiempo de expiración.</li>
<li class="align-left">Seleccioná los permisos <b>"whatsapp_business_messaging"</b> y <b>"whatsapp_business_management"</b></li>
<li class="align-left">Guardá y copiá el token generado. Guardá este token en un lugar seguro. Este token va a ser permanente y te va a permitir a vos y a cualquiera que lo tenga enviar mensajes por la API de WhatsApp Business.</li>
</ol>
</li>
</ul>
`,
                icon: 'info',

            })
            .then(result => {
                    if (result.isConfirmed) {
                        return setupWhatsappVariables(contacts, message)
                    }
                })
        });
    },
    preConfirm: () => {
        const whatsappPhoneId = (document.getElementById('input1') as HTMLInputElement)?.value;
        const whatsappToken = (document.getElementById('input2') as HTMLInputElement)?.value;
        if (!whatsappPhoneId || !whatsappToken) {
            Swal.showValidationMessage(`Ingrese valores para ambos campos`);
        }
        return { whatsappPhoneId, whatsappToken };
    }
}).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('whatsappPhoneId', result.value.whatsappPhoneId)
            localStorage.setItem('whatsappToken', result.value.whatsappToken)
            console.log(result.value); // { input1Value: "someValue", input2Value: "someValue" }
            return handleSendMessage(contacts, message)
        }
    });


export function handleSendMessage (contacts: Contact[], message: string) {
    return Swal.fire({
        icon: 'warning',
        html: generateTableHTML(contacts),
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
            const [whatsappPhoneId, whatsappToken] = [localStorage.getItem('whatsappPhoneId'), localStorage.getItem('whatsappToken')]
            if (!whatsappToken || !whatsappPhoneId) return "setup"

            Swal.showLoading()

            const result = await Promise.all(contacts.map(contact => sendWhatsAppMessage(contact, message)
                .then(() => {
                    const element = document.querySelector(`#status-${contact.id}`)
                    if (element) element.innerHTML = okEmoji
                    return true
                })
                .catch(() => {
                    const element = document.querySelector(`#status-${contact.id}`)
                    if (element) element.innerHTML = errorEmoji
                    return false
                })
            ))

            const confirmButton = document.querySelector('.swal2-confirm');
            const cancelButton = document.querySelector('.swal2-cancel');
            if (confirmButton) confirmButton.classList.add("display-none")
            if (cancelButton) cancelButton.classList.add("display-none")

            return false
        }
    })
        .then(result => {
            if (result.value === "setup") {
                return setupWhatsappVariables(contacts, message)
            }
        })
}
