import type { Contact } from "@/types/row";

export function createPredicate(filters: Contact, keys: (keyof Contact)[]): (c: Contact) => boolean {
    return (c: Contact) => {
        for (const key of keys) {
            let [cValue, filterValue] = [c[key], filters[key]]
            if (typeof cValue === "number") {
                cValue = cValue.toString()
            }
            if (!cValue.toLowerCase().includes(filterValue.toLowerCase())) {
                return false;
            }
        }
        return true;
    };
}
