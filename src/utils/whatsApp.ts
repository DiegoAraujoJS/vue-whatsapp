import type { Contact } from "@/types/row"
import axios from "axios"

type MessageOptionals = {
    preview_url?: boolean
    after?: (contact: Contact) => void | Promise<void>
}

export function sendWhatsAppMessage(to: Contact, message: string, optionals?: MessageOptionals) {
    const ACCESS_TOKEN="EAAN91oK4HeEBO6ZBO4NdPWuJTYNxZClujUUhJch9il7DJPK4oE9GQK6mZBkeDvUSruivRcH2o4zaCPKF4eXF4KDMGuqHDDT6BfivTJTpXJZCFsmEtT9DPxU0viIyVZBQZAHLm4yzmUq9rrlFNRwgnKmU3ZCc088VDdTjEvHkGjt8ZCkILc0vXBCJKEZBvKKGmqoTlLVmAnvkCupGbvZAyH"
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
        }
    }

    return axios.post(endpoint, messageData, {headers})
        .then((res) => {
            if (optionals && optionals.after) {
                return Promise.resolve(optionals.after(to)).then(() => true)
            }
            return true
        })
        .catch(err => false)
}

export function massSendWhatsAppMessage(to: Contact[], message: string, optionals?: MessageOptionals) {
    return Promise.all(to.map(phoneNumber => sendWhatsAppMessage(phoneNumber, message, optionals)))
}
