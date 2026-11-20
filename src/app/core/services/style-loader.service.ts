import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class StyleLoaderService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  load(id: string, href: string): void {
    if (this.document.getElementById(id)) return;
    const link = this.document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    this.document.head.appendChild(link);
  }

  unload(id: string): void {
    this.document.getElementById(id)?.remove();
  }
}
