import type { CatalogFacets } from "../api/catalog.types";

export type FacetFiltersProps = {
    facets: CatalogFacets["attributes"];

    /**
     * Current selected attribute filters.
     * Example:
     * { color: ["red", "blue"], size: ["m"] }
     */
    value: Record<string, string[]>;

    /**
     * Called whenever selection changes.
     */
    onChange: (next: Record<string, string[]>) => void;
};

export function FacetFilters({ facets, value, onChange }: FacetFiltersProps) {
    const attributeEntries = Object.entries(facets);

    if (attributeEntries.length === 0) {
        return <div>No filters available.</div>;
    }

    function toggleValue(attributeCode: string, facetValue: string) {
        const currentValues = value[attributeCode] ?? [];
        const exists = currentValues.includes(facetValue);

        const nextValues = exists ? currentValues.filter((v) => v !== facetValue) : [...currentValues, facetValue];

        const next = { ...value };

        if (nextValues.length === 0) {
            delete next[attributeCode];
        } else {
            next[attributeCode] = nextValues;
        }

        onChange(next);
    }

    return (
        <div>
            {attributeEntries.map(([attributeCode, values]) => (
                <fieldset key={attributeCode} style={{ marginBottom: "1rem" }}>
                    <legend style={{ fontWeight: "bold" }}>{attributeCode}</legend>

                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {values.map((v) => {
                            const checked = (value[attributeCode] ?? []).includes(v.value);

                            return (
                                <li key={v.value}>
                                    <label style={{ display: "flex", gap: "0.5rem" }}>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleValue(attributeCode, v.value)}
                                        />
                                        <span>
                                            {v.value} ({v.count})
                                        </span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </fieldset>
            ))}
        </div>
    );
}
