export class LibraryNodeModel {
  label?: string;
  icon?: string;
  routerLink?: any;
  id?: string;
  pid?: string;
  items?: LibraryNodeModel[];
  visible?: boolean;
}

export class LibraryFlatNodeModel {
  label?: string;
  icon?: string;
  routerLink?: any;
  id?: string;
  pid?: string;
  level: number;
  expandable: boolean;
}


export class TreeItemNode {
  children: TreeItemNode[];
  item: string;
  code: string;
}

/** Flat to-do item node with expandable and level information */
export class TreeItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  code: string;
}