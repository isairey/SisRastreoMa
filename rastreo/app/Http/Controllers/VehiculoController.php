<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class VehiculoController extends Controller
{
    public function lista_vehiculos($id)
    {
        $vehiculo=DB::select("select  
        v.id_vehiculo,
        v.placa,
        
        v.marca,
        v.modelo,
        v.color,
        v.cilindrada,
        
        v.uniqueid,
        v.linea_gps,
        v.modelo_gps,
        v.fecha_registro,
        v.id_cliente,
        v.id_departamento,
        d.nombre_departamento
        from ras.tvehiculo v
        join ras.tdepartamento d on d.id_departamento=v.id_departamento 
        where v.id_cliente = ? ",[$id]);

        $arrayParametros=[
            'vehiculo'=>$vehiculo
        ];
        
        return response()->json($arrayParametros);

    }
    public function get_vehiculo($id)
    {

        $vehiculo=DB::select("select  
        v.id_vehiculo,
        v.placa,
        
        v.marca,
        v.modelo,
        v.color,
        v.cilindrada,
        
        v.uniqueid,
        v.linea_gps,
        v.modelo_gps,
        v.fecha_registro,
        v.id_cliente,
        v.id_departamento,
        d.nombre_departamento
        from ras.tvehiculo v
        join ras.tdepartamento d on d.id_departamento=v.id_departamento
        where v.id_vehiculo = ? ",[$id]);
                    
        
        $departamentos=DB::select("select 
                    d.id_departamento,
                    d.nombre_departamento
                    from ras.tdepartamento d ");

        $id_departamento = 0;
        if($id!=0){
            $id_departamento = $vehiculo[0]->id_departamento;
        }
        $departamento_seleccionado=DB::select("select 
                    d.id_departamento,
                    d.nombre_departamento
                    from ras.tdepartamento d
                    where d.id_departamento = ? ",[$id_departamento]);

        //return $json;
        $arrayParametros=[
            'vehiculo'=>$vehiculo,
            'departamentos'=>$departamentos,
            'departamento_seleccionado'=>$departamento_seleccionado
        ];
        
        return response()->json($arrayParametros);
    }

    public function post_vehiculo(Request $request){
        $validacion = $this->validar_vehiculo($request);
        $coockies = $this->iniciar_sesion_traccar();

        if($request->id_vehiculo==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into ras.tvehiculo(placa,uniqueid,linea_gps,modelo_gps,
                fecha_registro,id_cliente,id_departamento,marca,modelo,color,cilindrada)
                values(?,?,?,?,now()::timestamp,?,?,?,?,?,?)
                ',[$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,(int)$request->id_departamento,$request->marca,$request->modelo,$request->color,$request->cilindrada]);
                $this->post_device_traccar($coockies,$request->placa,$request->uniqueid);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){

                $uniqueid=DB::select('select v.uniqueid from ras.tvehiculo v where v.id_vehiculo = ? ',[(int)$request->id_vehiculo]);
                $id_geocerca = DB::select('select id from public.tc_devices where uniqueid=? ',[$uniqueid[0]->uniqueid]);
                $this->put_device_traccar($coockies,(int)$id_geocerca[0]->id,$request->placa,$request->uniqueid);

                DB::update('update ras.tvehiculo 
                set placa=?,
                uniqueid=?,
                linea_gps=?,
                modelo_gps= ?,
                fecha_registro= now()::timestamp,
                id_cliente= ?,
                id_departamento= ?,
                marca = ?,
                modelo = ?,
                color = ?,
                cilindrada = ?
                where id_vehiculo=?',
                [$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,(int)$request->id_departamento,$request->marca,$request->modelo,$request->color,$request->cilindrada,(int)$request->id_vehiculo]);

            }
        }

        $this->cerrar_sesion_traccar($coockies);

        $arrayParametros=[
        'mensaje'=>$validacion["mensaje"],
        'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);  
    }
    public function validar_vehiculo($request){
        $mensaje=[];
        $validacion=true;

        if($request->id_vehiculo!=0){

            $duplicado_placa=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.placa = ? and v.id_vehiculo != ? ',[$request->id_persona,$request->id_vehiculo]);
            if((int)($duplicado_placa[0]->cantidad)>0){
                array_push($mensaje,'El campo placa ya esta registrado');
                $validacion=false;
            }

            $duplicado_imei=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.uniqueid = ? and v.id_vehiculo != ? ',[$request->uniqueid,$request->id_vehiculo]);
            if((int)($duplicado_imei[0]->cantidad)>0){
                array_push($mensaje,'El campo Imei ya esta registrado');
                $validacion=false;
            }
           
        }
        else{

            $duplicado_placa=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.placa = ?  ',[$request->id_persona]);

            if((int)($duplicado_placa[0]->cantidad)>0){
                array_push($mensaje,'El campo placa ya esta registrado');
                $validacion=false;
            }
            $duplicado_imei=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.uniqueid = ?  ',[$request->uniqueid]);

            if((int)($duplicado_imei[0]->cantidad)>0){
                array_push($mensaje,'El campo Imei ya esta registrado');
                $validacion=false;
            }

        }


        $arrayParametros=[
        'mensaje'=>$mensaje,
        'validacion'=>$validacion
        ];

        return $arrayParametros;
    }
    public function eliminar_vehiculo($id){

        $coockies = $this->iniciar_sesion_traccar();

        $uniqueid=DB::select('select v.uniqueid from ras.tvehiculo v where v.id_vehiculo = ? ',[$id]);

        $id_geocerca = DB::select('select id from public.tc_devices where uniqueid=? ',[$uniqueid[0]->uniqueid]);
        $this->delete_device_traccar($coockies,(int)$id_geocerca[0]->id );

        db::update('delete from ras.tvehiculo  where id_vehiculo = ? ',[$id]);

        $this->cerrar_sesion_traccar($coockies);

        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }
    public function lista_vehiculos_usuario(Request $request)
    {

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $vehiculo=DB::select("select
                                v.id_vehiculo,
                                v.placa,
                                v.marca,
                                v.modelo,
                                v.color,
                                v.cilindrada,
                                v.uniqueid,
                                v.linea_gps,
                                v.modelo_gps,
                                v.fecha_registro,
                                v.id_cliente,
                                v.id_departamento,
                                d.nombre_departamento,
                                us.name as nombre_usuario,
                                p.nombre nombre_persona,
                                p.apellido_paterno,
                                p.apellido_materno
                                from ras.tvehiculo v
                                join ras.tdepartamento d on d.id_departamento=v.id_departamento
                                join ras.tcliente c on c.id_cliente=v.id_cliente
                                join ras.tpersona p on p.id_persona=c.id_persona
                                join segu.users us on us.id_persona=p.id_persona
                                where ".$ids." and us.estado=?
                                order by p.nombre,p.apellido_paterno,p.apellido_materno asc ",["activo"]);

        $arrayParametros=[
            'vehiculo'=>$vehiculo
        ];

        return response()->json($arrayParametros);

    }

}