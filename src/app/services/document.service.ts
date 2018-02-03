import { Injectable } from '@angular/core';
import { GraphQlService } from './graphQl.service';



@Injectable()
export class DocumentService {

    constructor(
        private gqls: GraphQlService
    ) {
    }

    generateAuthPaper(unionId: string, authName: string, authAddress: string, authPesel: string, authedPesel: string, ownerId: string, authedName: string, authedSurname: string) {
        const query = ` mutation {
            generateAuthPaper(unionId: "${unionId}", authName: "${authName}",
            authAddress: "${authAddress}", authPesel: "${authPesel}",  authedPesel: "${authedPesel},
            authedName: "${authedName},  authedSurname: "${authedSurname}",
            ownerId: "${ownerId}")
       }`;
        return this.gqls.createQuery(query);
    }
    generateNoticePaper(unionId: string, ownerId: string,
        status: string, resolutionId: string, stampAuth: InputStampAuth,
        accountName: string, address: string, bankAccount: string, title: string) {
        const query = ` mutation {
             generateNoticePaper(unionId: "${unionId}", ownerId: "${ownerId}",
             resolutionId: "${resolutionId}", address: "${address}",  accountName: "${accountName}",
              bankAccount: "${bankAccount}", stampAuth: { name: "${stampAuth.name}", surname: "${stampAuth.surname}",
              position: "${stampAuth.position}"}, status: "${status}", title: "${title}")
        }`;
        return this.gqls.createQuery(query);
    }
    generateCallPaper(unionId: String, ownerId: String, companyId: string,
        cashAddress: string, bankName: string, bankAccount: string, contactPhone: string,
        contactEmail: string, stampAuth: InputStampAuth) {
        const query = ` mutation {
            generateCallPaper(unionId: "${unionId}", ownerId: "${ownerId}",
            companyId: "${companyId}", cashAddress: "${cashAddress}",  bankName: "${bankName}",
            bankAccount: "${bankAccount}", contactPhone: "contactPhone", status: "${status}", contactEmail: "${contactEmail}",
            stampAuth: { name: "${stampAuth.name}", surname: "${stampAuth.surname}", position: "${stampAuth.position}"})
        }`;
        return this.gqls.createQuery(query);
    }
    generatePaymentPaper(unionId: string, ownerId: string, unionBankAccount: string, amount: string,
        payersBankAccount: string, payerName: string, title: string) {
        const query = ` mutation {
            generateAuthPaper(unionId: "${unionId}", unionBankAccount: "${unionBankAccount}",
            amount: "${amount}", payersBankAccount: "${payersBankAccount}",  payerName: "${payerName}",
            title: "${title}")
       }`;
        return this.gqls.createQuery(query);
    }



}


export interface InputStampAuth {
    name: string;
    surname: string;
    position: string;
}
