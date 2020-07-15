import { LibTreeService } from 'src/app/services/lib-tree.service';
import { LibraryNodeModel } from 'src/app/models/lib-tree.model';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { of as observableOf } from 'rxjs';


@Component({
  selector: 'app-lib-tree5',
  templateUrl: './lib-tree5.component.html',
  styleUrls: ['./lib-tree5.component.css']
})
export class LibTree5Component implements OnInit {
  nestedTreeControl: NestedTreeControl<LibraryNodeModel>;
  nestedDataSource: MatTreeNestedDataSource<LibraryNodeModel>;
  searchText: string;

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
  }

  private _getChildren = (node: LibraryNodeModel) => observableOf(node.items);
  hasNestedChild = (_: number, nodeData: LibraryNodeModel) => nodeData.items && nodeData.items.length > 0;

  public clearSearch() {
    this.searchText = '';
  }

  public searchKeyDown(ev) {
    if (ev.key === "Enter" || ev.key === "ArrowDown" || ev.key === "ArrowRight") {
      this.searchTree();
    };
  }

  public searchTree() {
    console.log("searchig...");
  }

}
