import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tipo, Usuario } from 'src/app/interfaces/usuario';
import { AlertService } from 'src/app/services/alert.service';
import { TipoDocumentoService } from 'src/app/services/tipoDocumento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin-usuario',
  templateUrl: './admin-usuario.component.html',
  styleUrls: ['./admin-usuario.component.css']
})
export class AdminUsuarioComponent implements OnInit {
  public usuarioForm: FormGroup;
  public btnText: string = '';
  private id: string = '';
  public tiposDocumento: Tipo[] = [];
  private usuario: Usuario;
  private estado;
  
  constructor(private form: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private usuarioServices: UsuarioService,
              private tipoService: TipoDocumentoService,
              private alert: AlertService) {

    this.usuarioForm = this.form.group({
      id: ['',  ],
      primerNombre: ['', Validators.required],
      tipo: ['', Validators.required],
      segundoNombre: ['', ],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', ],
      ciudad: ['', Validators.required ],
      direccion: ['', ],
      telefono: ['', Validators.required ],
    });

  }

  ngOnInit(): void {
    this.getTipoDocumentos();
    this.activatedRoute.params.subscribe(({id}) => {
      if(id !== 'crear') {
        this.id = id;
        this.obtenerUsuario();
      } else {
        this.btnText = 'Guardar';
      }
    });
  }

  public getTipoDocumentos() {
    this.tipoService.getTipoDocumentos().subscribe((documentos: any) => {
      this.tiposDocumento = documentos;
    });
  }

  public obtenerUsuario() {
    this.usuarioServices.ObtenerUsuarioById(this.id).subscribe((resp: any) => {
      console.log(resp);
      if(resp) {
        this.usuarioForm.setValue({
          id: resp.id,
          primerNombre: resp.primerNombre,
          tipo: resp.tipo.id,
          segundoNombre: resp.segundoNombre,
          primerApellido: resp.primerApellido,
          segundoApellido: resp.segundoApellido,
          ciudad: resp.ciudad,
          direccion: resp.direccion,
          telefono: resp.telefono,
        });
        this.usuario = resp;
        this.btnText = 'Actualizar';
      } else {
        this.alert.showAlert('Usuario','No existe el usuario', 'error');
        this.btnText = 'Guardar';
      }
    }, error => {
      this.btnText = 'Guardar';
      if(error.status === 400) {
        this.alert.showAlert('Usuario',error.error.result, 'error');
      } else {
        this.alert.showAlert('usuario',error.error.error.message, 'error');
      }
    });
  }

  public accionUsuario() {
    if(this.btnText === 'Guardar') {
      this.guardarUsuario();
    } else {
      this.actualizarUsuario();
    }
  }

  public guardarUsuario() {
    const tipo: any = this.tiposDocumento.filter(documento => documento.id.toString() === this.usuarioForm.value.tipo);
    this.setUsuario(tipo.nombre);
    this.usuarioServices.GuardarUsuario(this.usuario).subscribe((resp: any) => {
        this.alert.showAlert('Crear Usuario', 'Registro creado', 'success');
        this.usuario = resp;
        this.router.navigate(['/usuario', JSON.stringify(this.usuario)]);
    }, error => {
      this.alert.showAlert('Crear Usuario', error.error, 'error');
    });
  }

  public actualizarUsuario() {
    this.setUsuario();
    this.usuarioServices.GuardarUsuario(this.usuario).subscribe((resp: any) => {
        this.usuario = resp;
        this.alert.showAlert('Actualizar usuario', 'Registro Actualizado', 'success');
    }, error => {
      this.alert.showAlert('Actualizar usuario', error.error, 'error');
    });
  }

  public setUsuario(nombre?: string) {
    this.usuario = {
      id: this.usuarioForm.value.id,
      primerNombre: this.usuarioForm.value.primerNombre,
      tipo: {
        id: this.usuarioForm.value.tipo,
        nombre: nombre
      },
      segundoNombre: this.usuarioForm.value.segundoNombre,
      primerApellido: this.usuarioForm.value.primerApellido,
      segundoApellido: this.usuarioForm.value.segundoApellido,
      ciudad: this.usuarioForm.value.ciudad,
      direccion: this.usuarioForm.value.direccion,
      telefono: this.usuarioForm.value.telefono,
    }
  }

  public cancelar() {
    if(this.btnText === 'Actualizar') {
      this.router.navigate(['/usuario', JSON.stringify(this.usuario)]);
    } else {
      this.router.navigate(['/home']);
    }
  }

}
