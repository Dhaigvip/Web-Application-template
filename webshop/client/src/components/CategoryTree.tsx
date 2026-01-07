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
        return <div>Loading categories…</div>;
    }

    if (error) {
        return <div>Failed to load categories.</div>;
    }

    if (!data || data.length === 0) {
        return <div>No categories.</div>;
    }

    return (
        <nav aria-label="Categories">
            <ul>
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
                <button type="button" onClick={handleClick} aria-current={isSelected ? "true" : undefined}>
                    {node.name}
                </button>
            </div>

            {node.children.length > 0 && (
                <ul>
                    {node.children.map((child) => (
                        <CategoryNode key={child.path} node={child} onSelect={onSelect} selectedPath={selectedPath} />
                    ))}
                </ul>
            )}
        </li>
    );
}
