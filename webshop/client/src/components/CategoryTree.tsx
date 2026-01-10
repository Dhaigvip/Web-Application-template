import { useCategories } from "../hooks/useCategories";
import type { CatalogCategoryTreeNode } from "../api/catalog.types";

export type CategoryTreeProps = {
    /**
     * Called when a category is selected.
     * Receives Category.path (public identifier).
     */
    onSelect?: (path: string) => void;

    /**
     * Optional currently selected category path
     * (for highlighting in UI).
     */
    selectedPath?: string;
};

export function CategoryTree(props: CategoryTreeProps) {
    const { data, loading, error } = useCategories();

    if (loading) {
        return <div className="text-gray-600">Loading categories…</div>;
    }

    if (error) {
        return <div className="text-red-600">Failed to load categories.</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-gray-600">No categories.</div>;
    }

    return (
        <nav aria-label="Categories" className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Categories</h3>
            <ul className="space-y-1">
                {data.map((node) => (
                    <CategoryNode
                        key={node.path}
                        node={node}
                        onSelect={props.onSelect}
                        selectedPath={props.selectedPath}
                    />
                ))}
            </ul>
        </nav>
    );
}

type CategoryNodeProps = {
    node: CatalogCategoryTreeNode;
    onSelect?: (path: string) => void;
    selectedPath?: string;
};

function CategoryNode({ node, onSelect, selectedPath }: CategoryNodeProps) {
    const isSelected = selectedPath === node.path;

    function handleClick() {
        onSelect?.(node.path);
    }

    return (
        <li>
            <div>
                <button 
                    type="button" 
                    onClick={handleClick} 
                    aria-current={isSelected ? "true" : undefined}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        isSelected 
                            ? "bg-blue-100 text-blue-700 font-medium" 
                            : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    {node.name}
                </button>
            </div>

            {node.children.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                    {node.children.map((child) => (
                        <CategoryNode key={child.path} node={child} onSelect={onSelect} selectedPath={selectedPath} />
                    ))}
                </ul>
            )}
        </li>
    );
}
