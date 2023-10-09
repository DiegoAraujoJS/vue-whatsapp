import type { Contact } from "@/types/row";

export function createPredicate(filters: Contact, keys: (keyof Contact)[]): (c: Contact) => boolean {
    return (c: Contact) => {
        for (const key of keys) {
            if (!c[key].toLowerCase().includes(filters[key])) {
                return false;
            }
        }
        return true;
    };
}
