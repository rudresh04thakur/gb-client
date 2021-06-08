import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employees } from '../employees';
import { Router, ActivatedRoute } from '@angular/router'
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  editUsr: any;
  oldUsr: any;
  editdisabled: any;
  msg: any;
  employees: Employees[] = [];
  displayedColumns: any = ['id', 'name', 'doj', 'city', 'actions'];
  groupByColumns = ['city'];
  constructor(public emp: EmployeeService, private r: Router) { }

  ngOnInit() {

    this.emp.cMsg.subscribe((msg) => {
      this.msg = msg;
      // console.log("GG == ",this.msg)
    })

    this.loadEmp()

  }

  public delete(id: any) {
    if (confirm("Are sure to delete record ID - " + id)) {
      this.emp.delete(id).subscribe(() => {
        this.emp.changeMsg('Employee Deleted!');
        console.log("employee deleted");
        this.loadEmp()
      })
    }
  }

  loadEmp() {
    this.emp.getAll().subscribe((data: Employees[]) => {
      this.employees = data;
      console.log("emp", this.employees);
    })
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
