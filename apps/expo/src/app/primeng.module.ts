import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MessagesModule } from 'primeng/messages';
import { MenuModule } from 'primeng/menu';

const primeNgModules = [
  ButtonModule,
  MenubarModule,
  InputTextModule,
  AvatarModule,
  MessagesModule,
  MenuModule,
];

@NgModule({
  imports: primeNgModules,
  exports: primeNgModules,
})
export class PrimengModule {}
