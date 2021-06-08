import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employees } from '../employees';
import { Router, ActivatedRoute } from '@angular/router'
import * as $ from 'jquery';
import { MatTableDataSource } from '@angular/material/table';
export class Group {
  level = 0;
  parent: Group | undefined;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-grouptable',
  templateUrl: './grouptable.component.html',
  styleUrls: ['./grouptable.component.css']
})
export class GrouptableComponent implements OnInit {

 
  editUsr: any;
  oldUsr: any;
  editdisabled: any;
  msg: any;
  employees: Employees[] = [];
  employeeData = new MatTableDataSource<Employees | Group>([]);
  columns: any[] = [];


  displayedColumns: any; // = ['id', 'name', 'doj', 'city', 'actions'];
  groupByColumns = ['city'];
  constructor(public emp: EmployeeService, private r: Router) { }

  ngOnInit() {
    this.columns = [
      { field: 'id' },
      { field: 'name' },
      { field: 'doj' },
      { field: 'city' }
    ];
    this.displayedColumns = this.columns.map((column: any) => column.field);

    this.emp.cMsg.subscribe((msg) => {
      this.msg = msg;
      // console.log("GG == ",this.msg)
    })

    this.loadEmp()

  }

  public delete(id: any) {
    this.emp.delete(id).subscribe(() => {
      this.emp.changeMsg('Employee Deleted!');
      console.log("employee deleted");
      this.loadEmp()
    })
  }

  loadEmp() {
    this.emp.getAll().subscribe((data: Employees[]) => {
      this.employees = data;
      this.employeeData.data = this.addGroups(data, this.groupByColumns);
      this.employeeData.filterPredicate = this.customFilterPredicate.bind(this);
      this.employeeData.filter = performance.now().toString();
    })
  }
/////////////////////////////////////////////////////////////////

groupBy(event:any, column:any) {
  event.stopPropagation();
  this.checkGroupByColumn(column.field, true);
  this.employeeData.data = this.addGroups(this.employees, this.groupByColumns);
  this.employeeData.filter = performance.now().toString();
}

checkGroupByColumn(field:any, add:any ) {
  let found = null;
  for (const column of this.groupByColumns) {
    if (column === field) {
      found = this.groupByColumns.indexOf(column, 0);
    }
  }
  if (found != null && found >= 0) {
    if (!add) {
      this.groupByColumns.splice(found, 1);
    }
  } else {
    if ( add ) {
      this.groupByColumns.push(field);
    }
  }
}

unGroupBy(event:any, column:any) {
  event.stopPropagation();
  this.checkGroupByColumn(column.field, false);
  this.employeeData.data = this.addGroups(this.employees, this.groupByColumns);
  this.employeeData.filter = performance.now().toString();
}

// below is for grid row grouping
customFilterPredicate(data: any | Group, filter: string): boolean {
  return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
}

getDataRowVisible(data: any): boolean {
  const groupRows = this.employeeData.data.filter(
    (row:any) => {
      if (!(row instanceof Group)) {
        return false;
      }
      let match = true;
      this.groupByColumns.forEach((column:any) => {
        if (!row[column] || !data[column] || row[column] !== data[column]) {
          match = false;
        }
      });
      return match;
    }
  );

  if (groupRows.length === 0) {
    return true;
  }
  const parent = groupRows[0] as Group;
  return parent.visible && parent.expanded;
}

groupHeaderClick(row:any) {
  row.expanded = !row.expanded;
  this.employeeData.filter = performance.now().toString();  // bug here need to fix
}

addGroups(data: any[], groupByColumns: string[]): any[] {
  const rootGroup = new Group();
  rootGroup.expanded = true;
  return this.getSublevel(data, 0, groupByColumns, rootGroup);
}

getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
  if (level >= groupByColumns.length) {
    return data;
  }
  const groups = this.uniqueBy(
    data.map(
      (row:any) => {
        const result:any = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (let i = 0; i <= level; i++) {
          result[groupByColumns[i]] = row[groupByColumns[i]];
        }
        return result;
      }
    ),
    JSON.stringify);

  const currentColumn = groupByColumns[level];
  let subGroups:any = [];
  groups.forEach((group:any) => {
    const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
    group.totalCounts = rowsInGroup.length;
    const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
    subGroup.unshift(group);
    subGroups = subGroups.concat(subGroup);
  });
  return subGroups;
}

uniqueBy(a:any, key:any) {
  const seen:any = {};
  return a.filter((item:any) => {
    const k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

isGroup(index:any, item:any): boolean {
  return item.level;
}

  //////////////////////////////////////////////////////////////


  editRow(usr: any) {
    console.log(usr)
    this.editUsr = usr && usr.Id ? usr : {};
    this.oldUsr = { ...this.editUsr };
  }
  updateEdit(id: any) {
    //updateEdit
    this.editdisabled = true;
    this.emp.update(id, this.editUsr)
      .subscribe((data: any) => {
        this.editUsr = {};
        this.editdisabled = false;
        if (data.Data && data.Status == 1) {
          this.oldUsr = {};
        } else {
          this.cancelEdit();
        }
      });
  }
  cancelEdit() {

  }



}

