import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Component, OnInit, HostBinding } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'mwc-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documents: { link: string, name: string }[] = [];
  constructor(
    public router: Router,
    public af: AngularFirestore,
    public us: UserService
  ) {
    this.us.currentUser.subscribe((cu) => {
      this.af.collection('unions').doc(cu.unionId).collection('documents').ref.get().then((ds) => {
        ds.docs.map((d) => {
          const ref = this.af.app.storage().ref(d.id);
          return { name: ref.name, linkPromise: ref.getDownloadURL() };
        }).forEach((lps) => {
          lps.linkPromise.then((link) => this.documents.push({ link, name: lps.name }));
        });
      });
    });
  }

  ngOnInit() {
  }

}
