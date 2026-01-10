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
        return <div className="text-gray-600">No filters available.</div>;
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
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            {attributeEntries.map(([attributeCode, values]) => (
                <fieldset key={attributeCode} className="mb-4 last:mb-0">
                    <legend className="font-semibold text-gray-900 mb-2 capitalize">{attributeCode}</legend>

                    <ul className="space-y-2">
                        {values.map((v) => {
                            const checked = (value[attributeCode] ?? []).includes(v.value);

                            return (
                                <li key={v.value}>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleValue(attributeCode, v.value)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {v.value} <span className="text-gray-500">({v.count})</span>
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
