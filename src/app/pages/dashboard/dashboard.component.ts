import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../core/services/home.service';
import { DashboardData } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getDashboard().subscribe((d) => (this.data = d));
  }
}
