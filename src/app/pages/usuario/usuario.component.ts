import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AlertService } from 'src/app/services/alert.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  public usuario;
  public cargando = false;

  constructor(private routerActivate: ActivatedRoute,
              private alert: AlertService,
              private usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit(): void {
    this.routerActivate.params.subscribe(param => {
      this.usuario = JSON.parse(param.usuario);
      console.log(this.usuario);
    });
  }

  public buscar() {
    this.router.navigate(['/buscar']);
  }

  public actualizarUsuario(id: string) {
    this.router.navigate(['/usuario-admin', id]);
  }

  public eliminarUsuario(){
    this.alert.showCuestion(`Desea eliminar a ${this.usuario.primerNombre}`).then((result: any) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(this.usuario.id).subscribe((resp: any) => {
          console.log(resp);
          if(resp.includes('elimino')) {
            this.alert.showAlert('Eliminar', resp, 'success');
            this.router.navigate(['/buscar']);
          } else {
            this.alert.showAlert('Eliminar', resp, 'error');
          }
        }, error => {
          if(error.status === 200) {
            if(error.error.text.includes('elimino')) {
              this.alert.showAlert('Eliminar', error.error.text, 'success');
              this.router.navigate(['/buscar']);
            } else {
              this.alert.showAlert('Eliminar', error.error.text, 'error');
            }
          } else {
            if(error.error.mensaje) {
              this.alert.showAlert('Eliminar',error.error.mensaje, 'error');
            } else {
              this.alert.showAlert('Error','Hubo un problema', 'error');
            }
          }
        });
      }
    });
  }

}
