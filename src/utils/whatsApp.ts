import type { Contact } from "@/types/row"
import axios from "axios"

type MessageOptionals = {
    preview_url: boolean
}

export function sendWhatsAppMessage(to: Contact, message: string, optionals?: MessageOptionals) {
    const ACCESS_TOKEN="EAAN91oK4HeEBO6n0dbkO9c0tYRZAJzSbZCl0W8rF70DtLPZBOUZC2ATYAmFA7DZC6b09nGDPubpoHJOkO7vZArvnnRK87i2kW5W6tXU33ZC2BVmAcpgZC9qF6pOVsJK9pUJR03EtKX0ef997gZAAWYotkhsvlrdsB96BrpyN68ZB0zzno97vKMZBBxKr6EbEfyP9s4UbLndZAJvcRfTcNKHZA"
    const PHONE_NUMBER_ID="105575149275875"

    const endpoint = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
    const headers = {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const messageData = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        to: to.numero,
        "type": "text",
        "text": {
            "body": message,
            ...(optionals ?? {})
        }
    }

    return axios.post(endpoint, messageData, {headers})
}

export function massSendWhatsAppMessage(to: Contact[], message: string, optionals?: MessageOptionals) {
    return Promise.all(to.map(phoneNumber => sendWhatsAppMessage(phoneNumber, message, optionals)))
}
