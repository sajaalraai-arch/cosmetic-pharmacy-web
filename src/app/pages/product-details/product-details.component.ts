import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductDetails } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ImgUrlPipe],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetails | null = null;
  loaded = false;
  categoryId: number | null = null;

  currentImage: string | null | undefined = '';
  activeThumb: string | null | undefined = '';
  fading = false;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap.get('categoryId');
    this.categoryId = qp ? Number(qp) : null;

    this.route.paramMap.subscribe((params) => {
      this.productService.getById(Number(params.get('id'))).subscribe({
        next: (p) => {
          this.product = p;
          this.currentImage = p.mainImageUrl;
          this.activeThumb = p.mainImageUrl;
          this.loaded = true;
        },
        error: () => {
          this.product = null;
          this.loaded = true;
        }
      });
    });
  }

  changeImage(url: string | null | undefined): void {
    this.fading = true;
    setTimeout(() => {
      this.currentImage = url;
      this.fading = false;
    }, 120);
    this.activeThumb = url;
  }
}
