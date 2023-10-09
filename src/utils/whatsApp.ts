import type { Contact } from "@/types/row"
import axios from "axios"

type MessageOptionals = {
    preview_url?: boolean
}

export function sendWhatsAppMessage(to: Contact, message: string, optionals?: MessageOptionals) {

    const endpoint = `https://graph.facebook.com/v17.0/${localStorage.getItem('whatsappPhoneId')}/messages`;
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('whatsappToken')}`,
        'Content-Type': 'application/json'
    };

    const messageData = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        to: to.numero,
        "type": "text",
        "text": {
            "body": message,
        }
    }

    return axios.post(endpoint, messageData, {headers})
}
