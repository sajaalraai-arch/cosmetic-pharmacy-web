import { Directive, ElementRef, HostListener } from '@angular/core';



@Directive({ selector: 'img[appImgFallback]', standalone: true })
export class ImgFallbackDirective {
  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    img.style.display = 'none';
    const next = img.nextElementSibling as HTMLElement | null;
    if (next) next.style.display = 'block';
  }
}

@Directive({ selector: '[appSettingsMenu]', standalone: true })
export class SettingsMenuDirective {
  constructor(private host: ElementRef<HTMLElement>) {}

  private boxes(): HTMLElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.setting-cuurency-box, .setting-languge-box'));
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const box = target.closest('.setting-cuurency-box, .setting-languge-box') as HTMLElement | null;
    if (!box) return;

    event.stopPropagation();

    const option = target.closest('.setting-currency-option, .setting-languge-option') as HTMLElement | null;
    if (option) {
      event.preventDefault();
      const selected = box.querySelector<HTMLElement>('.selected-curency, .selected-languge');
      if (selected) selected.textContent = option.textContent;
      box.classList.remove('active');
      return;
    }

    this.boxes().forEach((b) => { if (b !== box) b.classList.remove('active'); });
    box.classList.toggle('active');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.boxes().forEach((b) => b.classList.remove('active'));
    }
  }
}
