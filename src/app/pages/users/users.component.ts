import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/models';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  customers: Customer[] = [];
  totalUsers = 0;
  activeUsers = 0;
  bannedUsers = 0;

  searchTerm = '';
  roleFilter = 'All';
  statusFilter = 'All';

  editingId: number | null = null;
  edit = { fullName: '', email: '', userRole: 'Customer', userStatus: 'Active' };

  showAdd = false;
  add = { fullName: '', email: '', userRole: 'Admin', userStatus: 'Active' };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.customerService.getAll(this.searchTerm.trim(), this.roleFilter, this.statusFilter).subscribe({
      next: (res) => {
        this.customers = res.customers;
        this.totalUsers = res.totalUsers;
        this.activeUsers = res.activeUsers;
        this.bannedUsers = res.bannedUsers;
      },
      error: (err) => Swal.fire('Error', extractError(err), 'error')
    });
  }

  filterUsers(status: string): void {
    this.showAdd = false;
    this.statusFilter = status;
    this.load();
  }

  // ---------------- التعديل داخل الصف ----------------
  enableEdit(item: Customer): void {
    this.editingId = item.customerId;
    this.edit = {
      fullName: item.fullName,
      email: item.email,
      userRole: item.userRole ?? 'Customer',
      userStatus: item.userStatus ?? 'Active'
    };
  }

  disableEdit(): void {
    this.editingId = null;
  }

  saveChanges(item: Customer): void {
    this.customerService
      .update(item.customerId, this.edit.fullName, this.edit.email, this.edit.userRole, this.edit.userStatus)
      .subscribe({
        next: () => {
          this.editingId = null;
          Swal.fire({ icon: 'success', title: 'Great!', text: 'User updated successfully.', confirmButtonColor: '#697c70' });
          this.load();
        },
        error: (err) => Swal.fire('Error', extractError(err), 'error')
      });
  }

  // ---------------- الحذف ----------------
  confirmDelete(item: Customer): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'will be deleted user: ' + item.fullName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'yes!، deleted',
      cancelButtonText: 'backed',
      reverseButtons: true
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.customerService.delete(item.customerId).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Great!', text: 'User deleted successfully.', confirmButtonColor: '#697c70' });
          this.load();
        },
        error: (err) => Swal.fire('Error', extractError(err), 'error')
      });
    });
  }

  // ---------------- إضافة مستخدم ----------------
  showAddRow(): void {
    this.showAdd = true;
  }

  cancelAdd(): void {
    this.showAdd = false;
    this.add = { fullName: '', email: '', userRole: 'Admin', userStatus: 'Active' };
  }

  saveUser(): void {
    if (!this.add.fullName || !this.add.email) {
      Swal.fire('Error', 'Please enter name and email', 'error');
      return;
    }
    this.customerService.create(this.add.fullName, this.add.email, this.add.userRole, this.add.userStatus).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Done!', text: 'User added successfully!', confirmButtonColor: '#697c70' });
        this.cancelAdd();
        this.load();
      },
      error: (err) => Swal.fire('Error', extractError(err), 'error')
    });
  }
}
