<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class ServicioController extends Controller
{
    public function lista_servicio(Request $request)
    {
        /*if($this->es_admin($request->user()->id)==true){
            $condicion=" where  0=0 ";
        }else{
            $condicion=" where s.id_usuario_reg = ".$request->user()->id." ";
        }*/

        $servicio=DB::select("select 
        s.id_servicio,
        s.fecha_servicio,
        s.costo_total,
        ts.tipo_servicio,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        us.name as usuario_reg,
        s.fecha_reg
        from ras.tcliente c
        join ras.tpersona p on p.id_persona=c.id_persona
        join ras.tservicio s on s.id_cliente = c.id_cliente
        join ras.ttipo_servicio ts on ts.id_tipo_servicio=s.id_tipo_servicio
        join segu.users us on us.id=s.id_usuario_reg");

        $arrayParametros=[
            'servicio'=>$servicio
        ];
        
        return response()->json($arrayParametros);

    }
    public function lista_pago_servicio($id){

        $servicio=DB::select("select ps.id_pago_servicio,
        ps.precio_mensual,
        ps.cantidad_meses,
        ps.cantidad_vehiculos,
        ps.fecha_inicio,
        ps.fecha_fin,
        us.name as usuario_reg,
        ps.fecha_pago,
        ps.sub_total
        from ras.tpago_servicio ps
        join segu.users us on us.id=ps.id_usuario_reg
        where ps.id_servicio=?",[$id]);

        $arrayParametros=[
            'pago_servicio'=>$servicio
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function lista_pago_servicio_usuario(Request $request){

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $servicio=DB::select("select
                                p.nombre,
                                p.apellido_paterno,
                                p.apellido_materno,
                                p.ci,
                                p.celular,
                                ps.fecha_pago::date,
                                ps.fecha_inicio::Date,
                                ps.fecha_fin::Date,
                                ps.cantidad_vehiculos,
                                ps.precio_mensual,
                                ps.sub_total
                            from  ras.tcliente c
                                join ras.tservicio s on s.id_cliente=c.id_cliente
                                join ras.tpago_servicio ps on ps.id_servicio=s.id_servicio
                                join ras.tpersona p on p.id_persona=c.id_persona
                                join segu.users us on us.id_persona=p.id_persona
                            where ".$ids." and us.estado=?
                            order by p.nombre,p.apellido_paterno,p.apellido_materno,ps.fecha_inicio,ps.fecha_fin ",["activo"]);

        $arrayParametros=[
            'pago_servicio'=>$servicio
        ];

        return response()->json($arrayParametros);
    }
    public function filtros_monitoreo(Request $request){


        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" u.id = ".$request->user()->id." ";
        }

        $lista_vehiculo=DB::select("select 
                                    v.id_vehiculo,
                                    v.placa
                                    from ras.tvehiculo v
                                    inner join ras.tcliente c on v.id_cliente=c.id_cliente 	
                                    inner join ras.tpersona p on p.id_persona=c.id_persona
                                    left join segu.users u on p.id_persona=u.id_persona
                                    where ".$ids." ");

        $arrayParametros=[
            'lista_vehiculo'=>$lista_vehiculo
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function monitoreo_tiempo_real(Request $request){


        $id_vehiculos=$request->id_vehiculos;

        $lista_monitoreo_tiempo_real=DB::select("select
                                    v.placa,
                                    p.latitude,
                                    p.longitude,
                                    p.address,
                                    (p.speed * 1.852)::numeric as speed,
                                    p.devicetime,
                                    p.course,
                                    p.attributes,
                                    coalesce( (p.attributes::json->'power'), (p.attributes::json->'batteryLevel') )::varchar as bateria_vehiculo
                                    from ras.tvehiculo v
                                    inner join public.tc_devices d on v.uniqueid=d.uniqueid
                                    inner join public.tc_positions p on p.id=d.positionid
                                    where v.id_vehiculo in(".$id_vehiculos.")  ");

        $arrayParametros=[
            'lista_monitoreo_tiempo_real'=>$lista_monitoreo_tiempo_real
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function monitoreo_rutas(Request $request){

        $lista_monitoreo_tiempo_real=DB::select(" select  
        placa,
        latitude,
        longitude,
        address,
        speed,
        devicetime,
        course,
        bateria_vehiculo,
        encendido,
        evento,
        tiempo_parqueo
        from ras.f_get_parqueos(?,?,?) ",[$request->id_vehiculos,$request->fecha_inicio,$request->fecha_fin]);

        $arrayParametros=[
            'lista_monitoreo_tiempo_real'=>$lista_monitoreo_tiempo_real
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function reporte_parqueos(Request $request){
        $lista_parqueos_vehiculos=DB::select(" select  
        placa,
        latitude,
        longitude,
        address,
        devicetime::date,
        tiempo_parqueo,
        hora_inicio,
        hora_fin,
        bateria_vehiculo
        from ras.f_reporte_parqueos(?,?,?) ",[$request->id_vehiculos,$request->fecha_inicio,$request->fecha_fin]);

        $arrayParametros=[
            'lista_parqueos_vehiculos'=>$lista_parqueos_vehiculos
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function lista_geocercas (Request $request){

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" ug.id_usuario in (".$request->user()->id.")";
        }

        $query_notificacion = "select
        n.id as id_notificacion,
        case when n.type = 'geofenceExit' then 'Salio del geocerca'
        when n.type = 'geofenceEnter' then 'Entro al geocerca'
        when n.type = 'deviceOverspeed' then 'Exceso de velocidad'
        when n.type = 'maintenance' then 'Mantenimineto'
        when n.type = 'alarm' then 'Alarmas' else n.type end as notificacion
        from public.tc_notifications n ";
        
        $lista_notificacion =DB::select($query_notificacion);

        $geocerca=DB::select("select g.id,
                            g.name::varchar as nombre_geocerca,
                            g.description::varchar as descripcion,
                            g.area,
                            us.name as usuario,
                            ug.tipo_geocerca
                            from public.tc_geofences g
                            join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                            join segu.users us on us.id=ug.id_usuario
                            where ".$ids."  order by g.id desc ");

        $arrayParametros=[
            'lista_geocercas'=>$geocerca,
            'lista_notificacion'=>$lista_notificacion 
        ];
        
        return response()->json($arrayParametros);
    }
    public function post_geocerca(Request $request){

        $validacion = $this->validar_geocerca($request);
        $coockies = $this->iniciar_sesion_traccar();

        if($request->id==0){
            if((bool)$validacion["validacion"]==true){

                $this->post_geocerca_traccar($coockies,$request->nombre_geocerca,$request->descripcion,$request->area);
                //DB::insert('insert into public.tc_geofences (name,description,area) values(?,?,?);',[$request->nombre_geocerca,$request->descripcion,$request->area]);
                $id_geocerca=DB::select('select max(g.id)::integer as id_geocerca from public.tc_geofences g');
                //DB::insert('insert into public.tc_user_geofence (userid,geofenceid) values(1,?);',[(int)$id_geocerca[0]->id_geocerca]);
                DB::insert('insert into ras.tusuario_geocerca (id_usuario,id_geocerca,tipo_geocerca) values(?,?,?);',[($request->user()->id),(int)$id_geocerca[0]->id_geocerca,$request->tipo_geocerca]);
            
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){

                $this->put_geocerca_traccar($coockies,$request->id,$request->nombre_geocerca,$request->descripcion,$request->area);
                //DB::update('update public.tc_geofences set name =?,description=? ,area=? where id=?; ',[$request->nombre_geocerca,$request->descripcion,$request->area,$request->id]);
                DB::update('update ras.tusuario_geocerca set tipo_geocerca=? where id_geocerca = ?;',[$request->tipo_geocerca,$request->id]);
            }
            
        }

        $this->cerrar_sesion_traccar($coockies);

        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ]; 

        return response()->json($arrayParametros);
    }
    public function validar_geocerca($request){
        $mensaje=[];
        $validacion=true;


        $cantidad_geocerca=DB::select("select count(*) as cantidad
        from public.tc_geofences g
                 join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                 join segu.users us on us.id=ug.id_usuario
        where us.id = ? ",[(int)$request->user()->id]);

        if($request->id==0){//para nuevo geocerca
            if((int)($cantidad_geocerca[0]->cantidad) > 4){ //limite de geocerca 5 por usuario solo validamos en registros nuevos
                array_push($mensaje,'El limite de geocercas es de 5 por usuario, para incrementar el limite de geocerca contactese con el administrador ');
                $validacion=false;
            }
        }

        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
    public function eliminar_geocerca($id){

        $coockies = $this->iniciar_sesion_traccar();
        $this->delete_geocerca_traccar($coockies,$id);
        $this->cerrar_sesion_traccar($coockies);
        //db::delete('delete from public.tc_geofences where id=? ',[$id]);

        $arrayParametros=[
            'mensaje'=>"ok"
        ];
        
        return $arrayParametros;
    }
    public function lista_geocercas_seleccionados (Request $request ,$id_vehiculo){

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" ug.id_usuario in (".$request->user()->id.")";
        }

        $query_notificacion = "select
        n.id as id_notificacion,
        case when n.type = 'geofenceExit' then 'Salio del geocerca'
        when n.type = 'geofenceEnter' then 'Entro al geocerca'
        when n.type = 'deviceOverspeed' then 'Exceso de velocidad'
        when n.type = 'maintenance' then 'Mantenimineto'
        when n.type = 'alarm' then 'Alarmas' else n.type end as notificacion
        from public.tc_notifications n ";

        
        $lista_notificacion =DB::select($query_notificacion);

        $lista_notificacion_seleccionados =DB::select("select
        n.id as id_notificacion,
        case when n.type = 'geofenceExit' then 'Salio del geocerca'
             when n.type = 'geofenceEnter' then 'Entro al geocerca'
             when n.type = 'deviceOverspeed' then 'Exceso de velocidad'
             when n.type = 'maintenance' then 'Mantenimineto'
             when n.type = 'alarm' then 'Alarmas' else n.type end as notificacion

        from public.tc_notifications n
        join public.tc_device_notification dn on dn.notificationid = n.id
        join public.tc_devices d on d.id=dn.deviceid
        join ras.tvehiculo v on v.uniqueid=d.uniqueid
        where v.id_vehiculo = ? ",[$id_vehiculo]);


        $geocerca=DB::select("select g.id,
                            g.name::varchar as nombre_geocerca,
                            g.description::varchar as descripcion,
                            g.area,
                            us.name as usuario,
                            ug.tipo_geocerca
                            from public.tc_geofences g
                            join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                            join segu.users us on us.id=ug.id_usuario
                            where ".$ids."  order by g.id desc ");

        $lista_geocercas_seleccionados=DB::select("select g.id,
                            g.name::varchar as nombre_geocerca,
                            g.description::varchar as descripcion,
                            g.area ,
                            us.name as usuario ,
                            ug.tipo_geocerca
                            from public.tc_geofences g
                            join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                            join segu.users us on us.id=ug.id_usuario
                            join public.tc_device_geofence dg on dg.geofenceid=g.id
                            join public.tc_devices d on d.id=dg.deviceid
                            join ras.tvehiculo v on v.uniqueid=d.uniqueid
                            where v.id_vehiculo = ? ",[$id_vehiculo]);

        $arrayParametros=[
            'lista_geocercas'=>$geocerca,
            'lista_geocercas_seleccionados'=>$lista_geocercas_seleccionados,
            'lista_notificacion'=>$lista_notificacion,
            'lista_notificacion_seleccionados'=>$lista_notificacion_seleccionados 
        ];
        
        return response()->json($arrayParametros);
    }
    public function post_geocercas_seleccionados (Request $request){

        $coockies = $this->iniciar_sesion_traccar();


        $longitud_geocerca = count($request->lista_geocercas_seleccionados);
        $deviceid =DB::select("
        select d.id as deviceid
        from public.tc_devices d
        join ras.tvehiculo v on v.uniqueid=d.uniqueid
        where v.id_vehiculo = ?",[(int)$request->id_vehiculo]);

        
        $lista_eliminar_geocerca=DB::select("
                                    select deviceid,geofenceid from public.tc_device_geofence where deviceid =?
                                    ",[(int)$deviceid[0]->deviceid]);

        for ($i=0; $i < count($lista_eliminar_geocerca); $i++) { 

            $this->delete_permissions_geocerca_device($coockies,(int)$lista_eliminar_geocerca[$i]->deviceid,(int)$lista_eliminar_geocerca[$i]->geofenceid); 
        }

        $lista_eliminar_notificacion=DB::select("
                                    select deviceid,notificationid from public.tc_device_notification where deviceid = ?
                                    ",[(int)$deviceid[0]->deviceid]);

        for ($i=0; $i < count($lista_eliminar_notificacion); $i++) { 

            $this->delete_permissions_notificacion_device($coockies,(int)$lista_eliminar_notificacion[$i]->deviceid,(int)$lista_eliminar_notificacion[$i]->notificationid); 
        }

        //DB::delete("delete from public.tc_device_geofence where deviceid = ? ",[(int)$deviceid[0]->deviceid]);
        for($i=0; $i<$longitud_geocerca; $i++){      
            //DB::insert('insert into public.tc_device_geofence (deviceid,geofenceid) values(?,?)',[(int)$deviceid[0]->deviceid,(int)$request->lista_geocercas_seleccionados[$i]["id"]]);
            $this->post_permissions_geocerca_device($coockies, (int)$deviceid[0]->deviceid, (int)$request->lista_geocercas_seleccionados[$i]["id"]);
        }

        $longitud_notificaciones = count($request->lista_notificaciones_seleccionados);
        //DB::delete("delete from public.tc_device_notification where deviceid = ? ",[(int)$deviceid[0]->deviceid]);
        for($i=0; $i<$longitud_notificaciones; $i++){      
            $this->post_permissions_notificacion_device($coockies, (int)$deviceid[0]->deviceid, (int)$request->lista_notificaciones_seleccionados[$i]["id_notificacion"]);
            //DB::insert('insert into public.tc_device_notification (deviceid,notificationid) values(?,?)',[(int)$deviceid[0]->deviceid,(int)$request->lista_notificaciones_seleccionados[$i]["id_notificacion"]]);
        }

        $validacion = $this->validar_geocercas_seleccionados($request);

        $this->cerrar_sesion_traccar($coockies);
        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ]; 

        return response()->json($arrayParametros);
    }
    public function validar_geocercas_seleccionados($request){
        $mensaje=[];
        $validacion=true;
        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
}