import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'imgUrl', standalone: true })
export class ImgUrlPipe implements PipeTransform {
  transform(value: string | null | undefined, fallback = 'assets/images/no-image.svg'): string {
    if (!value || !value.trim()) return fallback;
    const v = value.trim();
    if (/^(https?:|data:|blob:)/i.test(v)) return v;
    if (v.startsWith('/') || v.startsWith('assets/')) return v;
    return '/images/' + v;
  }
}


@Pipe({ name: 'orderStatus', standalone: true })
export class OrderStatusPipe implements PipeTransform {
  transform(stateId: number | null | undefined): string {
    switch (stateId) {
      case 1: return 'Pending';
      case 2: return 'Processing';
      case 3: return 'Completed';
      default: return 'Cancelled';
    }
  }
}
