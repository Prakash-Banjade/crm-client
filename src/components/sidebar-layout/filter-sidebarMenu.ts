import { TGroupMenuItem, TSidebarMenuItem } from "./sidebar";

export const filterSidebarMenu = (
    menuGroups: TGroupMenuItem[],
    searchString: string
): TGroupMenuItem[] => {
    // Convert search string to lowercase for case-insensitive matching
    const searchLower = searchString.toLowerCase();

    // Function to filter individual menu items
    const filterItems = (items: TSidebarMenuItem[]): TSidebarMenuItem[] => {
        return items
            .map((item) => {
                // Check if the current item matches the search string
                const isMatch = item.title.toLowerCase().includes(searchLower);

                // If the item has nested items, filter them as well
                let filteredNestedItems: Omit<TSidebarMenuItem, "icon" | "items">[] =
                    [];
                if (item.items) {
                    filteredNestedItems = filterItems(item.items);
                }

                // If current item matches or any nested items match, return a new item object
                if (isMatch || filteredNestedItems.length > 0) {
                    return {
                        ...item,
                        // Only include nested items that match
                        items: filteredNestedItems.length > 0 ? filteredNestedItems : undefined,
                    };
                }

                // If no match, return null (to be filtered out)
                return null;
            })
            .filter((item) => item !== null) as TSidebarMenuItem[];
    };

    // Filter the entire menu groups
    return menuGroups
        .map((group) => {
            const filteredItems = filterItems(group.menuItems);
            // Only include groups with matching menu items
            if (filteredItems.length > 0) {
                return {
                    ...group,
                    menuItems: filteredItems,
                };
            }
            return null;
        })
        .filter((group) => group !== null) as TGroupMenuItem[];
};
