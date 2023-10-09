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
                Swal.fire({
                    title: 'Ingrese sus datos de Whatsapp Business',
                    html: `
                        <div>
                        <div style="display:flex" class="align-center">
                        <span>Whatsapp Phone Id</span>
                        <input type="text" id="input1" class="swal2-input" placeholder="First Input">
                        </div>
                        <div style="display:flex" class="align-center">
                        <span>Whatsapp Token</span>
                        <input type="text" id="input2" class="swal2-input" placeholder="Second Input">
                        </div>
                        </div>
                    `,
                    focusConfirm: false,
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
                        }
                    });
            }
        })
}
