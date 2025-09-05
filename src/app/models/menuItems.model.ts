export interface SubMenuItem {
    label: string;
    icons: string;   // for child icons
    path: string;
}

export interface MenuItem {
    label: string;
    icon: string;    // for parent icons
    roles: string[];
    path?: string;   // optional, as parent may not have a path
    isExpanded?: boolean;
    children?: SubMenuItem[];
}
