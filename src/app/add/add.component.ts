import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {


  constructor(
    public fb: FormBuilder,
    private router: Router,
    public emp: EmployeeService
  ) { }

  employeeForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.employeeForm = this.fb.group({
      id: [''],
      name: [''],
      doj: [''],
      city: [''],
    })
  }


  submitForm() {
    this.emp.create(this.employeeForm.value).subscribe(res => {
      this.emp.changeMsg('Employee Added!');
      console.log('Employee Added!')
      this.router.navigateByUrl('/home')
    })
  }

}




