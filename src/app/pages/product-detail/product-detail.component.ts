import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CommentService } from '../../core/services/comment.service';
import { CommentItem, ProductDetails } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { extractError } from '../../core/services/http-helpers';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ImgUrlPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: ProductDetails | null = null;
  mainImage = '';
  qty = 1;
  showDetails = false;
  activeTab: 'desc' | 'ing' | 'use' = 'desc';

  comments: CommentItem[] = [];
  newComment = '';
  newRating = 0;
  readonly starValues = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private commentService: CommentService,
    private auth: AuthService
  ) {}

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  ngOnInit(): void {
   
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.productService.getById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.mainImage = product.mainImageUrl ?? '';
          this.qty = 1;
          this.loadComments(id);
        },
        error: () => this.router.navigate(['/shop'])
      });
    });
  }

  private loadComments(productId: number): void {
    this.commentService.getByProduct(productId).subscribe({
      next: (list) => (this.comments = list),
      error: () => (this.comments = [])
    });
  }

  changeQty(delta: number): void {
    const current = Number(this.qty) || 1;
    const max = Math.min(this.product?.stockQuantity ?? 1, 50);
    if (delta > 0 && current < max) this.qty = current + 1;
    else if (delta < 0 && current > 1) this.qty = current - 1;
    else this.qty = current;
  }

  private requireLogin(): boolean {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  addToCart(): void {
    if (!this.product || !this.requireLogin()) return;
    this.cartService.addToCart(this.product.productId, Number(this.qty) || 1).subscribe({
      next: () => this.router.navigate(['/cart']),
      error: (err) => alert(extractError(err))
    });
  }

  buyNow(): void {
    if (!this.product || !this.requireLogin()) return;
    this.cartService.addToCart(this.product.productId, Number(this.qty) || 1).subscribe({
      next: () => this.router.navigate(['/checkout']),
      error: (err) => alert(extractError(err))
    });
  }

  toggleHeart(event: Event): void {
    event.preventDefault();
    const icon = (event.currentTarget as HTMLElement).querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
      icon.classList.toggle('active');
    }
  }

  scrollToReviews(): void {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  addComment(): void {
    if (!this.product || !this.newComment.trim() || !this.newRating) return;
    if (!this.isLoggedIn) {
      alert('You need to log in first to post a comment.');
      return;
    }
    this.commentService.add(this.product.productId, this.newComment.trim(), this.newRating).subscribe({
      next: (c) => {
        this.comments = [c, ...this.comments];
        this.newComment = '';
        this.newRating = 0;
      },
      error: (err) => alert(extractError(err))
    });
  }


  stars(rating?: number | null): string {
    const filled = rating ?? 0;
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }


  canDelete(c: CommentItem): boolean {
    return this.auth.isAdmin() || this.auth.currentUser?.customerId === c.customerId;
  }

  deleteComment(c: CommentItem): void {
    if (!confirm('Delete this comment?')) return;
    this.commentService.delete(c.id).subscribe({
      next: () => (this.comments = this.comments.filter((x) => x.id !== c.id)),
      error: (err) => alert(extractError(err))
    });
  }
}
