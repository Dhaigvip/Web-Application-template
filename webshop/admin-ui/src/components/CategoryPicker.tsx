import type { AdminCategoryTreeNodeDto } from "../api/adminCatalog.api";

type Props = {
    nodes: AdminCategoryTreeNodeDto[];
    selectedPath: string | null;
    onSelect(path: string): void;
    level?: number;
};

export function CategoryPicker({ nodes, selectedPath, onSelect, level = 0 }: Props) {
    return (
        <ul className="space-y-1">
            {nodes.map((node) => (
                <li key={node.id} className="pl-4 border-l">
                    <label
                        className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 ${
                            selectedPath === node.path ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                    >
                        <input
                            type="radio"
                            className="accent-blue-600"
                            checked={selectedPath === node.path}
                            onChange={() => onSelect(node.path)}
                        />

                        <span className="font-medium">{node.name}</span>
                    </label>

                    {node.children.length > 0 && (
                        <div className="ml-4 mt-1">
                            <CategoryPicker
                                nodes={node.children}
                                selectedPath={selectedPath}
                                onSelect={onSelect}
                                level={level + 1}
                            />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}
