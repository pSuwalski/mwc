import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { JoinApplication, createEmptyJoinApplication } from '../../models/join-aplication';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateEmail, validatePhone, validatePostCode, validateNip } from '../shared/validators';
import { sanitizeNip } from '../../models/company';


@Component({
  selector: 'mwc-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  joinApplication: JoinApplication = createEmptyJoinApplication();
  appliedIndicator: 'succes' | 'defeat';
  joinApplicationForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private us: UserService
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  apply() {
    this.joinApplication.company.phone = this.joinApplication.company.phone ?
      this.joinApplication.company.phone : this.joinApplication.user.phone;
    this.joinApplication.user.companyName = this.joinApplication.company.name;
    this.joinApplication.company.nip = sanitizeNip(this.joinApplication.company.nip);
    this.joinApplication.user.companyId = this.joinApplication.company.nip;
    this.us.applyJoinApplication(this.joinApplication)
      .then(() => this.appliedIndicator = 'succes')
      .catch(() => this.appliedIndicator = 'defeat');
  }

  createForm() {
    this.joinApplicationForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      email: this.fb.control('', validateEmail),
      phone: this.fb.control('', validatePhone),
      companyName: this.fb.control('', Validators.required),
      companyEmail: this.fb.control('', validateEmail),
      companyPhone: this.fb.control('', Validators.compose([Validators.required, validatePhone])),
      address: this.fb.control('', Validators.required),
      apartment: this.fb.control(''),
      city: this.fb.control('', Validators.required),
      postCode: this.fb.control('', validatePostCode),
      nip: this.fb.control('', validateNip),
      password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(6)])),
    });
  }

}
