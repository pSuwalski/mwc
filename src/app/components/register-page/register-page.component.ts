import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { JoinApplication, createEmptyJoinApplication } from '../../models/join-aplication';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateEmail, validatePhone, validatePostCode, validateNip } from '../shared/validators';
import { sanitizeNip } from '../../models/company';
import { emptyCompany } from '../../models/company';
import { Address } from '../../models/address';


@Component({
  selector: 'mwc-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  joinApplication: JoinApplication = createEmptyJoinApplication();
  appliedIndicator: 'success' | 'defeat';
  joinApplicationForm: FormGroup;
  companyForms: FormGroup[] = [];

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
    this.joinApplication.union.phone = this.joinApplication.union.phone ?
      this.joinApplication.union.phone : this.joinApplication.user.phone;

    this.joinApplication.user.unionName = this.joinApplication.union.name;
    this.joinApplication.union.nip = sanitizeNip(this.joinApplication.union.nip);
    this.joinApplication.user.unionId = this.joinApplication.union.nip;
    this.companyForms.forEach((cf) => {
        this.joinApplication.union.companies.push({
          name: cf.controls.name.value,
          nip: cf.controls.nip.value,
          phone: cf.controls.phone.value,
          email: cf.controls.email.value,
          address: {
             streetAndNumber: cf.controls.streetAndNumber.value,
             city: cf.controls.city.value,
             apartment: cf.controls.apartment.value,
             postCode: cf.controls.postCode.value,
            }
        });
    });
    console.log(this.joinApplication);
    this.us.applyJoinApplication(this.joinApplication)
      .then((e) => this.appliedIndicator = 'success')
      .catch(() => this.appliedIndicator = 'defeat');
  }

  createForm() {
    this.joinApplicationForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      email: this.fb.control('', validateEmail),
      phone: this.fb.control('', validatePhone),
      unionName: this.fb.control('', Validators.required),
      unionEmail: this.fb.control('', validateEmail),
      unionPhone: this.fb.control('', Validators.compose([Validators.required, validatePhone])),
      address: this.fb.control('', Validators.required),
      apartment: this.fb.control(''),
      city: this.fb.control('', Validators.required),
      postCode: this.fb.control('', validatePostCode),
      nip: this.fb.control('', validateNip),
      password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(6)])),
    });
    this.addCompany();
  }

  addCompany() {
    this.companyForms.push(this.fb.group({
      streetAndNumber: ['', Validators.required],
      email: [''],
      name: ['', Validators.required],
      nip: ['', Validators.required],
      phone: ['', Validators.required],
      apartment: '',
      postCode: ['', Validators.required],
      city: ['', Validators.required]
    }));

  }

  removeCompany(i: number) {
    this.companyForms.splice(i, 1);
  }

}
