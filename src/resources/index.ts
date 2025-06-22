import AuthController from './auth/auth.controller';
import CompanyController from './company/company.controller';
import CustomerController from './customers/customers.controller';
import InvoiceController from './invoices/invoices.controller';
import DocumentSignatureController from './qr_signature/qr_signature.controller';
import UserController from './users/users.controller';

export default [
  new CustomerController(),
  new UserController(),
  new DocumentSignatureController(),
  new InvoiceController(),
  new CompanyController(),
  new AuthController()
];
