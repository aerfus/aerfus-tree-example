import { LibTreeService } from 'src/app/services/lib-tree.service';
import { LibraryNodeModel } from 'src/app/models/lib-tree.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { of as observableOf } from 'rxjs';


@Component({
  selector: 'app-lib-tree5',
  templateUrl: './lib-tree5.component.html',
  styleUrls: ['./lib-tree5.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LibTree5Component implements OnInit {
  nestedTreeControl: FlatTreeControl<LibraryNodeModel>;
  nestedDataSource: MatTreeNestedDataSource<LibraryNodeModel>;
  searchText: string;
  occurenceArr: string[];
  currentOccurenceIdx: number;
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
    });
    this.searchText = '';
    this.occurenceArr = [];
    this.currentOccurenceIdx = -1;
    this.isSearchActive = false;
  }

  private _getChildren = (node: LibraryNodeModel) => observableOf(node.items);

  hasNestedChild = (_: number, nodeData: LibraryNodeModel) =>
    !!nodeData.items && nodeData.items.length > 0;

  public highlight(node: LibraryNodeModel) {
    let label = node.label
    if(!this.searchText || !this.isSearchActive) {
      return label;
    }

    let focusId = this.getFocusedNodeId();
    let className = node.id !== focusId
      ? 'lib-tree-highlight'
      : 'lib-tree-highlight-focus';
    return label.replace(new RegExp(this.searchText, "gi"), match => {
      return '<span class="'+ className + '">' + match + '</span>';
    });
  }

  public clearFilter() {
    this.isSearchActive = false;
    this.searchText = '';
    this.nestedTreeControl.collapseAll();
    this.occurenceArr = [];

  }

  public searchKeyDown(ev) {
    if (ev.key === "Enter" || ev.key === "ArrowDown" || ev.key === "ArrowRight") {
      if (this.searchText) {
        this.filterTree();
        this.buildOccurenceArray();
        this.currentOccurenceIdx = -1;
        this.nextOccurence();
      } else {
        this.clearFilter();
      }
    };
  }

  public filterTree() {
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
    node.visible = this.isNodeMatch(node, text) || isVisible;
    return node.visible;
  }

  private buildOccurenceArray() {
    this.occurenceArr = [];
    let text = this.searchText.toLowerCase();
    this.nestedDataSource.data.forEach(childNode => {
      if (childNode.visible) {
        this.enlargeOccurenceArray(childNode, text);
      }
    });
  }

  private enlargeOccurenceArray(node: LibraryNodeModel, text: string) {
    if (!node.visible) {
      return;
    }
    if (this.isNodeMatch(node, text)) {
      this.occurenceArr.push(node.id);
    }
    if (node.items) {
      node.items.forEach(childNode => {
        if (childNode.visible) {
          this.enlargeOccurenceArray(childNode, text);
        }
      });
    }
  }

  private isNodeMatch(node: LibraryNodeModel, text: string): boolean {
    return node.label.toLowerCase().indexOf(text) > -1;;
  }

  public prevOccurence() {
    if (!this.occurenceArr) {
      this.currentOccurenceIdx = -1;
      return;
    }
    let newOccurenceIdx = this.currentOccurenceIdx - 1;
    if (newOccurenceIdx < 0) {
      newOccurenceIdx = this.occurenceArr.length - 1;
    }
    this.currentOccurenceIdx = newOccurenceIdx;
    this.scrollToOccurence();
  }

  public nextOccurence() {
    if (!this.occurenceArr) {
      this.currentOccurenceIdx = -1;
      return;
    }
    let newOccurenceIdx = this.currentOccurenceIdx + 1;
    if (newOccurenceIdx > this.occurenceArr.length - 1) {
      newOccurenceIdx = 0;
    }
    this.currentOccurenceIdx = newOccurenceIdx;
    this.scrollToOccurence();
  }

  private getFocusedNodeId(): string {
    if (this.currentOccurenceIdx > -1 && this.currentOccurenceIdx < this.occurenceArr.length) {
      return this.occurenceArr[this.currentOccurenceIdx];
    }
    return '';
  }

  private scrollToOccurence() {
    let focusId = this.getFocusedNodeId();
    let el = document.getElementById(focusId);
    el.scrollIntoView();
  }
}
