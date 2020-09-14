import {Injectable} from '@angular/core';
import {ExecuteCallProcedureService} from '../../system/generic/service/execute-call-procedure.service';
import {StorageAppService} from '../../system/generic/service/storage-app.service';
import {SolcitudCabeceraModel, SolcitudDetalleModel} from '../../classes/mensajeria/SolcitudCabeceraModel';
import {RequestOptions} from '../../system/generic/classes/RequestOptions';
import {COLOR_TOAST_SUCCESS} from '../../system/generic/classes/constant';
import {CRUD_ACTUALIZAR_SOLICITUD, CRUD_SOLICITUD} from '../../constantes/ConstanteTransaccional';
import {Articulo} from '../../classes/mensajeria/Articulo';
import {
    OBTENER_PEDIDOS,
    OBTENER_PEDIDOS_POR_USUARIO,
    OBTENER_PEDIDOS_USUARIO
} from '../../constantes/ConstanteConsulta';
import {Pedido} from '../../classes/mensajeria/Pedido';
import {PedidoInterface} from "../../interfaces/mensajeria/PedidoInterface";


@Injectable({
    providedIn: 'root'
})
export class SolicitudService {
    lstDetalle: SolcitudDetalleModel[] = [];

    constructor(private genericService: ExecuteCallProcedureService,
                private svrStorage: StorageAppService) {
        this.getDetalleSolicitud();
    }

    async actualizarSolicitud(solicitud: SolcitudCabeceraModel) {
        const requestOptions = new RequestOptions();
        const data = await this.genericService.servicioRestGenericoPost(solicitud, CRUD_ACTUALIZAR_SOLICITUD, requestOptions) as SolcitudCabeceraModel;
        return data;
    }

    async registarSolicitud(solicitud: SolcitudCabeceraModel) {
        const requestOptions = new RequestOptions();
        requestOptions.presentarToast = true;
        requestOptions.successMessaje = 'Su solicitud a sido generada, por favor espere pronto nos comunicaremos con usted';
        requestOptions.toastColor = COLOR_TOAST_SUCCESS;
        const data = await this.genericService.servicioRestGenericoPost(solicitud, CRUD_SOLICITUD, requestOptions) as Articulo;
        return data;
    }


    async obtenerPedidos() {
        const requestOptions = new RequestOptions();
        const data: Pedido[] = (await this.genericService.servicioRestGenericoGet({}, OBTENER_PEDIDOS, requestOptions)) as Pedido[];
        return data;
    }

    async obtenerPedidoPorUsuario(idUsuario) {
        const requestOptions = new RequestOptions();
        const data: PedidoInterface[] = (await this.genericService.servicioRestGenericoGet({}, OBTENER_PEDIDOS_USUARIO, requestOptions)) as PedidoInterface[];
        return data;
    }

    async obtenerPedidosPotUsuario(usuario: string) {
        const requestOptions = new RequestOptions();
        const data: PedidoInterface[] = (await this.genericService.servicioRestGenericoGet({usuario}, OBTENER_PEDIDOS_POR_USUARIO, requestOptions)) as PedidoInterface[];
        return data;
    }

    setDetalleSolcitud(detalle: SolcitudDetalleModel) {
        this.lstDetalle.push(detalle);
        this.svrStorage.setStorageObject(this.lstDetalle, 'DetalleSolicitud');
    }

    async getDetalleSolicitud() {
        if (await this.svrStorage.loadStorageObject('DetalleSolicitud')) {
            // @ts-ignore
            this.lstDetalle = await this.svrStorage.loadStorageObject('DetalleSolicitud');
        } else {
            this.lstDetalle = [];
        }
    }
}
