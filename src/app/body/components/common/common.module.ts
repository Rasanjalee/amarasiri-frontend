import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';



@NgModule({
  declarations: [
    ImageUploadComponent,
    ErrorModalComponent
  ],
    exports: [
        ImageUploadComponent,
        ErrorModalComponent
    ],
  imports: [
    CommonModule,
  ]
})
export class CommonComponentsModule { }
