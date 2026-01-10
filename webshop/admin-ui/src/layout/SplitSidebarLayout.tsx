import Split from "react-split";
import type { ReactNode } from "react";

type Props = {
    sidebar: ReactNode;
    children: ReactNode;
    sidebarSize?: number; // percent
};

export function SplitSidebarLayout({ sidebar, children, sidebarSize = 25 }: Props) {
    return (
        <Split
            className="flex h-full"
            sizes={[sidebarSize, 100 - sidebarSize]}
            minSize={[200, 400]}
            gutterSize={6}
            direction="horizontal"
        >
            {/* Sidebar */}
            <div className="bg-white shadow overflow-y-auto p-4">{sidebar}</div>

            {/* Main content */}
            <div className="overflow-y-auto p-4">{children}</div>
        </Split>
    );
}
