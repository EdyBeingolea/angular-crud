import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveProductDlgComponent } from '../save-product-dlg/save-product-dlg.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-home',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.scss'
})
export class ProductHomeComponent implements OnInit {
  columns: string[] = ['image', 'name', 'description', 'currency', 'price', 'state', 'action'];
  dataSource: Product[] = [];
  selectedStatus: boolean = true;
  filterValue: string = '';

  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    if (this.selectedStatus) {
      this.productService.getAll().subscribe(res => {
        console.log('Productos activos:', res.data);
        this.dataSource = res.data;
      });
    } else {
      this.productService.getInactive().subscribe(res => {
        console.log('Productos inactivos:', res.data);
        this.dataSource = res.data;
      });
    }
  }

  openProductDlg(product?: Product): void {
    const dialogRef = this.dialog.open(SaveProductDlgComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getProduct();
      }
    });
  }

  inactiveProduct(id: number) {
    this.productService.inactive(id).subscribe(res => {
      if (res.status) {
        this.getProduct();
        this.snackbar.open('Se inactivó el producto', 'Aceptar');
      }
    });
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value === 'true';
    this.getProduct();
  }

  applyFilter() {
    const filter = this.filterValue.trim().toLowerCase();
    if (filter === '') {
      this.getProduct();
    } else {
      this.dataSource = this.dataSource.filter((product: Product) => {
        return (
          product.name.toLowerCase().includes(filter) ||
          product.currencyCode.toLowerCase().includes(filter)
        );
      });
    }
  }
  


}
