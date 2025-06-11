import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  resource,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  Table,
  TableLazyLoadEvent,
  TableModule,
  TablePageEvent,
} from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../../service/product';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Provider, ProviderService } from '../../../service/provider';
import { Category, CategoryService } from '../../../service/category';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    AutoComplete,
    ChipModule,
  ],
  providers: [MessageService, ProductService, ConfirmationService],
  templateUrl: './products.html',
  styles: ``,
})
export class Products implements OnInit {
  productDialog: boolean = false;
  term: string = '';
  page: number = 0;
  perPage: number = 10;
  total: number = 0;

  loading: boolean = false;

  products = signal<Product[]>([]);

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  private providerService = inject(ProviderService);
  private categoryService = inject(CategoryService);
  providers = signal<Provider[]>([]);
  categories = signal<Category[]>([]);

  searchProvider(event: AutoCompleteCompleteEvent) {
    if (event.query.length < 3) return;
    this.providerService.getProvidersSimple(event.query).subscribe((data) => {
      this.providers.set(data.data);
    });
  }

  searchCategories(event: AutoCompleteCompleteEvent) {
    if (event.query.length < 3) return;
    this.categoryService.getCategories(event.query).subscribe((data) => {
      this.categories.set(data.data);
    });
  }

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // TODO load query params page and perPage
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadProviders = effect(() => {
    console.log('loadProviders');

    this.providerService.getProvidersSimple().subscribe((data) => {
      this.providers.set(data.data);
    });
  });

  loadCategories = effect(() => {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories.set(data.data);
    });
  });

  pageChange(event: TablePageEvent) {
    console.log(event);
    this.page = event.first;
    this.perPage = event.rows;
  }
  loadDemoData(event: TableLazyLoadEvent) {
    console.log(event);
    this.loading = true;

    this.productService
      .getProducts(
        this.page + 1,
        this.perPage,
        this.term.length > 2 ? this.term : undefined
      )
      .subscribe((data) => {
        this.loading = false;
        this.products.set(data.data);
        this.total = data.metadata.total;
      });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'categories', header: 'Categories' },
      { field: 'stock', header: 'Stock' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  onGlobalFilter(table: Table, event: Event) {
    this.term = (event.target as HTMLInputElement).value;
    this.resetMetadata();
  }

  openNew() {
    this.product = {} as Product;
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(
          this.products().filter((val) => !this.selectedProducts?.includes(val))
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  resetMetadata() {
    this.page = 0;
    this.perPage = 10;
    this.loadDemoData({});
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(
          this.products().filter((val) => val.id !== product.id)
        );
        this.product = {} as Product;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products().length; i++) {
      if (this.products()[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  saveProduct() {
    this.submitted = true;
    const { categories, provider, createdAt, updatedAt, ...rest } =
      this.product;
    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.productService
          .editProduct(this.product.id, {
            ...rest,
            categories: categories.map((c) => c.id),
            providerId: provider.id,
          })
          .subscribe((data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Updated',
              life: 3000,
            });
            this.resetMetadata();
          });
      } else {
        this.productService
          .createProduct({
            ...rest,
            categories: categories.map((c) => c.id),
            providerId: provider.id,
          })
          .subscribe((data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Created',
              life: 3000,
            });
            this.resetMetadata();
          });
      }

      this.productDialog = false;
      this.product = {} as Product;
    }
  }
}
