import { LibTreeService } from 'src/app/services/lib-tree.service';
import { LibraryNodeModel } from 'src/app/models/lib-tree.model';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { of as observableOf } from 'rxjs';


@Component({
  selector: 'app-lib-tree5',
  templateUrl: './lib-tree5.component.html',
  styleUrls: ['./lib-tree5.component.css']
})
export class LibTree5Component implements OnInit {
  nestedTreeControl: FlatTreeControl<LibraryNodeModel>;
  nestedDataSource: MatTreeNestedDataSource<LibraryNodeModel>;
  searchText: string;
  occurenceCount: number;
  isSearchActive: boolean;

  constructor(
    private dataService: LibTreeService,
  ) { }

  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl<LibraryNodeModel>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.dataService.getLibTreeItems().subscribe(data => {
      this.nestedDataSource.data = data;
      this.nestedTreeControl.dataNodes = data;
      /*Object.keys(this.nestedDataSource.data).forEach(x => {
          this.setParent(this.nestedDataSource.data[x], null);
      });*/
    });
    this.searchText = '';
    this.occurenceCount = 0;
    this.isSearchActive = false;
  }

  private _getChildren = (node: LibraryNodeModel) => observableOf(node.items);

  hasNestedChild = (_: number, nodeData: LibraryNodeModel) =>
    !!nodeData.items && nodeData.items.length > 0;

  public clearFilter() {
    this.isSearchActive = false;
    this.searchText = '';
    this.nestedTreeControl.collapseAll();
  }

  public searchKeyDown(ev) {
    if (ev.key === "Enter" || ev.key === "ArrowDown" || ev.key === "ArrowRight") {
      if (this.searchText) {
        this.filterTree();
      } else {
        this.clearFilter();
      }
    };
  }

  public filterTree() {
    this.occurenceCount = 0;
    let text = this.searchText.toLowerCase();
    this.nestedDataSource.data.forEach(childNode => {
      this.filterNodeByName(childNode,text);
    });
    this.isSearchActive = true;
    this.nestedTreeControl.expandAll();
  }

  private filterNodeByName(node: any, text: string): boolean {
    let isVisible = false;
    if (node.items) {
      node.items.forEach(childNode => {
        let isChildVisible = this.filterNodeByName(childNode, text);
        if (!isVisible) {
          isVisible = isChildVisible;
        }
      });
    }
    node.visible = this.isLabelMatch(node.label, text) || isVisible;
    return node.visible;
  }

  private isLabelMatch(label: string, text: string): boolean {
    let isMatch = label.toLowerCase().indexOf(text) > -1;
    if (isMatch) {
      this.occurenceCount++;
    }
    return isMatch;
  }

}
