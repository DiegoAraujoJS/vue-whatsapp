import { generateContacts } from "@/scripts/bootstrapContacts";
import type { Contact } from "@/types/row";

export const parseExcel = async (): Promise<{
    schema: {
        name: "string",
        number: "number"
        [k: string]: "string" | "number"
    },
    results: Contact[]
}> => {
    // Do stuff here
    const contacts: any[] = generateContacts(100)
    const schema: {[k: string]: "string" | "number"} = {}
    for (let c of contacts) {
        Object.keys(c).forEach(k => {
            const columnType = Number.isNaN(parseInt(c[k])) ? "string" : "number"
            if (schema[k] && schema[k] !== columnType) {
                schema[k] = "string"
            }
        })
    }
    return {
        schema: {
            name: "string",
            number: "number",
            ...schema
        },
        results: contacts
    }
}
