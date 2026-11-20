import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HomeService } from '../../core/services/home.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Category, ProductListItem } from '../../core/models/models';
import { ImgUrlPipe } from '../../core/pipes/pipes';
import { SettingsMenuDirective } from '../../core/directives/directives';
import { extractError } from '../../core/services/http-helpers';

interface Ad { title: string; desc: string; mainImg: string; }
interface Testimonial { text: string; img: string; alt: string; name: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ImgUrlPipe, SettingsMenuDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  topProducts: ProductListItem[] = [];
  wishlist = new Set<number>();
  readonly cartCount$ = this.cartService.count$;


  readonly ads: Ad[] = [
    { title: 'Future<br>of facial<br>cosmetics', desc: 'Our next-generation products are the answer to all your skincare needs.', mainImg: 'assets/images/c4c028c8132ac1ddc2c8049b1a186efa-removebg-preview.png' },
    { title: 'Advanced<br>Night<br>Recovery', desc: 'Wake up to radiant, youthful-looking skin with our deep repair technology.', mainImg: 'assets/images/add2.png' },
    { title: 'Organic<br>Herbal<br>Essence', desc: 'The power of nature bottled in our most advanced organic formula yet.', mainImg: 'assets/images/add3.png' }
  ];
  currentIdx = 0;
  fading = false;
  previewImg = 'assets/images/add2.png';
  previewTitle = 'Pure Glow Night';

 
  readonly testimonials: Testimonial[] = [
    { text: "The Vitamin C serum is a game changer! My skin has never looked so radiant and even-toned. It's now a staple in my morning routine.", img: 'assets/images/2.png', alt: 'Sarah', name: 'Amal Mansour' },
    { text: "Finally found a moisturizer that doesn't break me out. It feels so lightweight but keeps my skin hydrated all day long.", img: 'assets/images/2.png', alt: 'Noura', name: 'Lina Khalid' },
    { text: 'The clay mask is magic for pores. After just two uses, my skin texture improved significantly. Highly recommend for oily skin!', img: 'assets/images/photo-1535713875002-d1d0cf377fde.jpeg', alt: 'Laila', name: 'Ali omar' },
    { text: 'Fast delivery and premium packaging. You can tell they care about quality. My dark circles are finally fading away.', img: 'assets/images/photo-1500648767791-00dcc994a43e.jpeg', alt: 'Omar', name: 'Omar Salem' }
  ];
  activeDot = 0;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  constructor(
    private homeService: HomeService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.homeService.getHome().subscribe({
      next: (data) => {
        this.categories = data.categories;
        this.topProducts = data.topProducts;
      },
      error: (err) => console.error(extractError(err))
    });
  }

  get currentAd(): Ad {
    return this.ads[this.currentIdx];
  }

  rotateAds(): void {
    const nextIdx = (this.currentIdx + 1) % this.ads.length;
    const thirdIdx = (nextIdx + 1) % this.ads.length;
    this.fading = true;

    setTimeout(() => {
      this.currentIdx = nextIdx;
      const preview = this.ads[thirdIdx];
      this.previewTitle = preview.title.replace('<br>', ' ').substring(0, 15) + '...';
      this.previewImg = preview.mainImg;
      this.fading = false;
    }, 500);
  }

  scrollToProducts(): void {
    document.getElementById('topProducts')?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleWish(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.wishlist.has(productId)) this.wishlist.delete(productId);
    else this.wishlist.add(productId);
  }

  addToCart(productId: number): void {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => this.router.navigate(['/cart']),
      error: (err) => alert(extractError(err))
    });
  }


  private scrollAmount(): number {
    const card = this.scrollContainer.nativeElement.querySelector<HTMLElement>('.section__card');
    return (card ? card.offsetWidth : 300) + 32;
  }

  next(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -this.scrollAmount(), behavior: 'smooth' });
  }

  prev(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: this.scrollAmount(), behavior: 'smooth' });
  }

  goToDot(index: number): void {
    const el = this.scrollContainer.nativeElement;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (index / (this.testimonials.length - 1)) * maxScroll;
    el.scrollTo({ left: -target, behavior: 'smooth' });
  }

  updateActive(): void {
    const el = this.scrollContainer.nativeElement;
    const scrollLeft = Math.abs(el.scrollLeft);
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      this.activeDot = Math.round((scrollLeft / maxScroll) * (this.testimonials.length - 1));
    }
  }
}
