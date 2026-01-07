import type { AdminCategoryTreeNodeDto } from "../api/adminCatalog.api";

type Props = {
    nodes: AdminCategoryTreeNodeDto[];
    selectedPath: string | null;
    onSelect(path: string): void;
};

export function CategoryPicker({ nodes, selectedPath, onSelect }: Props) {
    return (
        <ul>
            {nodes.map((node) => (
                <li key={node.id}>
                    <label>
                        <input type="radio" checked={selectedPath === node.path} onChange={() => onSelect(node.path)} />
                        {node.name}
                    </label>

                    {node.children.length > 0 && (
                        <CategoryPicker nodes={node.children} selectedPath={selectedPath} onSelect={onSelect} />
                    )}
                </li>
            ))}
        </ul>
    );
}
