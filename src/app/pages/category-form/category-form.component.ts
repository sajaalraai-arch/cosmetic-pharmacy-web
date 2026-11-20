import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImgUrlPipe],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  isEdit = false;
  categoryId = 0;

  categoryName = '';
  imageUrl = '';
  isActive = true;
  imageFile: File | null = null;
  previewSrc = '';

  saving = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private router: Router, private categoryService: CategoryService) {}

  ngOnInit(): void {
 
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.categoryId = Number(id);
      this.categoryService.getById(this.categoryId).subscribe({
        next: (c) => {
          this.categoryName = c.categoryName;
          this.imageUrl = c.categoryImage ?? '';
          this.previewSrc = this.imageUrl;
          this.isActive = c.isActive;
        },
        error: () => this.router.navigate(['/admin/categories'])
      });
    }
  }

  handleUrlInput(): void {
    if (this.imageUrl.trim() !== '') {
      this.imageFile = null;
      this.previewSrc = this.imageUrl.trim();
    } else {
      this.previewSrc = '';
    }
  }

  handleFileInput(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      this.imageFile = null;
      this.previewSrc = '';
      return;
    }
    this.imageFile = file;
    this.imageUrl = '';
    const reader = new FileReader();
    reader.onload = (e) => (this.previewSrc = e.target?.result as string);
    reader.readAsDataURL(file);
  }

  save(): void {
    this.errorMessage = '';
    this.saving = true;

    const form = new FormData();
    form.append('CategoryName', this.categoryName);
    form.append('ImageUrl', this.imageUrl ?? '');
    form.append('IsActive', String(this.isActive));
    if (this.imageFile) form.append('ImageFile', this.imageFile);

    const request = this.isEdit
      ? this.categoryService.update(this.categoryId, form)
      : this.categoryService.create(form);

    request.subscribe({
      next: () => this.router.navigate(['/admin/categories']),
      error: (err) => {
        this.saving = false;
        this.errorMessage = extractError(err);
      }
    });
  }
}
