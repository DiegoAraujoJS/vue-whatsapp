import type { Contact } from "@/types/row";

export function createPredicate(filters: Contact, keys: (keyof Contact)[]): (c: Contact) => boolean {
    return (c: Contact) => {
        for (const key of keys) {
            let [cValue, filterValue] = [c[key], filters[key]]
            if (typeof cValue === "number") {
                filterValue = Number(filterValue)
                return cValue === filterValue
            }
            if (!cValue.toLowerCase().includes(filterValue.toLowerCase())) {
                return false;
            }
        }
        return true;
    };
}
