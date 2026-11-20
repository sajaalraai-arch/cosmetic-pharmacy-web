import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { extractError } from '../../core/services/http-helpers';

interface ProductFormModel {
  productName: string;
  productSlug: string;
  categoryId: string | number;
  brand: string;
  barcode: string;
  targetType: string;
  size: string;
  countryOfOrigin: string;
  expiryDate: string;
  productDescription: string;
  ingredients: string;
  usageInstructions: string;
  price: number | null;
  discountPrice: number | null;
  stockQuantity: number | null;
  isActive: boolean;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImgUrlPipe],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  isEdit = false;
  productId = 0;
  categoryId: number | null = null;   

  categories: Category[] = [];
  brands: string[] = [];
  readonly targetTypes = ['Oily Skin', 'Dry Skin', 'Sensitive Skin', 'Normal Skin', 'All Types'];

  model: ProductFormModel = {
    productName: '', productSlug: '', categoryId: '', brand: '', barcode: '', targetType: '', size: '',
    countryOfOrigin: '', expiryDate: '', productDescription: '', ingredients: '', usageInstructions: '',
    price: null, discountPrice: null, stockQuantity: null, isActive: true
  };


  previews: Record<string, string> = { main: '', g1: '', g2: '', g3: '' };
  private files: Record<string, File | null> = { main: null, g1: null, g2: null, g3: null };

  saving = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap.get('categoryId');
    this.categoryId = qp ? Number(qp) : null;
    if (this.categoryId && !this.isEditRoute()) this.model.categoryId = this.categoryId;

    this.categoryService.getAll().subscribe((list) => (this.categories = list));
    this.productService.getAll().subscribe((res) => {
      this.brands = Array.from(new Set(res.products.map((p) => p.brand).filter((b): b is string => !!b)));
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = Number(id);
      this.productService.getById(this.productId).subscribe({
        next: (p) => {
          this.model = {
            productName: p.productName ?? '',
            productSlug: p.productSlug ?? '',
            categoryId: p.categoryId ?? '',
            brand: p.brand ?? '',
            barcode: p.barcode ?? '',
            targetType: p.targetType ?? '',
            size: p.size ?? '',
            countryOfOrigin: p.countryOfOrigin ?? '',
            expiryDate: (p.expiryDate ?? '').substring(0, 10),
            productDescription: p.productDescription ?? '',
            ingredients: p.ingredients ?? '',
            usageInstructions: p.usageInstructions ?? '',
            price: p.price,
            discountPrice: p.discountPrice ?? null,
            stockQuantity: p.stockQuantity,
            isActive: p.isActive
          };
          this.previews['main'] = p.mainImageUrl ?? '';
          this.previews['g1'] = p.productImages[0]?.imageUrl ?? '';
          this.previews['g2'] = p.productImages[1]?.imageUrl ?? '';
          this.previews['g3'] = p.productImages[2]?.imageUrl ?? '';
        },
        error: () => this.goBack()
      });
    }
  }

  private isEditRoute(): boolean {
    return !!this.route.snapshot.paramMap.get('id');
  }

  generateSlug(): void {
    this.model.productSlug = this.model.productName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  onFile(key: string, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) return;
    this.files[key] = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.previews[key] = e.target?.result as string);
    reader.readAsDataURL(file);
  }

  clearImage(key: string, event: Event): void {
    event.stopPropagation();
    this.files[key] = null;
    this.previews[key] = '';
    const inputId = key === 'main' ? 'mainFile' : key;
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (input) input.value = '';
  }

  private goBack(): void {
    if (this.categoryId) this.router.navigate(['/admin/categories', this.categoryId, 'products']);
    else this.router.navigate(['/admin/products']);
  }

  save(): void {
    this.errorMessage = '';
    const m = this.model;

    const hasDiscount = m.discountPrice !== null && m.discountPrice !== undefined && String(m.discountPrice) !== '';
    if (hasDiscount && Number(m.discountPrice) > Number(m.price)) {
      this.errorMessage = 'Discount price cannot be higher than the base price.';
      alert(this.errorMessage);
      return;
    }

    this.saving = true;

    const form = new FormData();
    form.append('ProductName', m.productName);
    form.append('ProductSlug', m.productSlug ?? '');
    form.append('CategoryId', String(m.categoryId));
    form.append('Brand', m.brand);
    form.append('Barcode', m.barcode);
    form.append('TargetType', m.targetType);
    form.append('Size', m.size);
    form.append('CountryOfOrigin', m.countryOfOrigin);
    form.append('ExpiryDate', m.expiryDate);
    form.append('ProductDescription', m.productDescription);
    form.append('Ingredients', m.ingredients);
    form.append('UsageInstructions', m.usageInstructions);
    form.append('Price', String(m.price ?? ''));
    if (m.discountPrice !== null && m.discountPrice !== undefined && String(m.discountPrice) !== '') {
      form.append('DiscountPrice', String(m.discountPrice));
    }
    form.append('StockQuantity', String(m.stockQuantity ?? ''));
    form.append('IsActive', String(m.isActive));

    if (this.files['main']) form.append('ImageFile', this.files['main']!);
    if (this.files['g1']) form.append('GalleryImage1', this.files['g1']!);
    if (this.files['g2']) form.append('GalleryImage2', this.files['g2']!);
    if (this.files['g3']) form.append('GalleryImage3', this.files['g3']!);

    const request = this.isEdit
      ? this.productService.update(this.productId, form)
      : this.productService.create(form);

    request.subscribe({
      next: () => this.goBack(),
      error: (err) => {
        this.saving = false;
        this.errorMessage = extractError(err);
        alert(this.errorMessage);
      }
    });
  }
}
