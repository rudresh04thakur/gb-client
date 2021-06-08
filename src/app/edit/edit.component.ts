import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public emp: EmployeeService,
    private ar: ActivatedRoute,
  ) { }

  employeeForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.employeeForm = this.fb.group({
      id: [''],
      name: [''],
      doj: [''],
      city: [''],
    })
    if (this.ar.snapshot.params.id != undefined) {
      const id = this.ar.snapshot.params.id;
      this.emp.getById(id).subscribe(res => {
        this.employeeForm.patchValue(res);
      });
    } 
  }


  submitForm(id:any) {
    this.emp.update(id,this.employeeForm.value).subscribe(res => {
      this.emp.changeMsg('Employee Updated!');
      console.log('Employee Updated!')
      this.router.navigateByUrl('/home')
    })
  }

}




