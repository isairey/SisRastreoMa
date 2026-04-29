<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class ClienteController extends Controller
{
    public function lista_cliente(Request $request)
    {
        $cliente=DB::select("select  
        c.id_cliente,
        c.id_persona,
        c.id_usuario_reg,
        c.id_usuario_mod,
        c.fecha_reg::varchar,
        c.fecha_mod::varchar,
        c.fecha_fin_servicio::varchar,
        c.direccion,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        u.name as usuario_reg,
        us.name as usuario_mod
        from ras.tcliente c
        join ras.tpersona p on p.id_persona=c.id_persona
        left join segu.users u on u.id=c.id_usuario_reg
        left join segu.users us on us.id=c.id_usuario_mod
        order by c.id_cliente desc ");

        $arrayParametros=[
            'cliente'=>$cliente
        ];
        
        return response()->json($arrayParametros);

    }
    public function get_cliente($id)
    {

        $clientes=DB::select("select  
        c.id_cliente,
        c.id_persona,
        c.id_usuario_reg,
        c.id_usuario_mod,
        c.fecha_reg,
        c.fecha_mod,
        c.fecha_fin_servicio,
        c.direccion,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        u.name as usuario_reg,
        us.name as usuario_mod
        from ras.tcliente c
        join ras.tpersona p on p.id_persona=c.id_persona
        left join segu.users u on u.id=c.id_usuario_reg
        left join segu.users us on us.id=c.id_usuario_mod
        where c.id_cliente = ? ",[$id]);
                    
        
        $personas=DB::select("select 
                    p.id_persona,
                    p.nombre,
                    p.apellido_paterno,
                    p.apellido_materno,
                    p.ci,
                    p.celular
                    from ras.tpersona p
                    where p.estado = ? ",["activo"]);

        $id_persona = 0;
        if($id!=0){
                $id_persona = $clientes[0]->id_persona;
        }
        $persona_seleccionado=DB::select("select 
                    p.id_persona,
                    p.nombre,
                    p.apellido_paterno,
                    p.apellido_materno,
                    p.ci,
                    p.celular
                    from ras.tpersona p
                    where p.estado = ? and p.id_persona=? ",["activo" ,$id_persona ]);

        //return $json;
        $arrayParametros=[
            'cliente'=>$clientes,
            'personas'=>$personas,
            'persona_seleccionado'=>$persona_seleccionado
        ];
        
        return response()->json($arrayParametros);
    }
    public function post_cliente(Request $request){
        $validacion = $this->validar_cliente($request);

        if($request->id_cliente==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into ras.tcliente(direccion,id_persona,id_usuario_reg,fecha_reg)
                values(?,?,?,now()::timestamp)',[$request->direccion,(int)$request->id_persona,$request->user()->id]);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){
                DB::update('update ras.tcliente 
                set direccion=?,
                id_persona=?,
                id_usuario_mod=?,
                fecha_mod= now()::timestamp
                where id_cliente=?',
                [$request->direccion,(int)$request->id_persona,$request->user()->id,$request->id_cliente]);
                
            }
        }

        $arrayParametros=[
        'mensaje'=>$validacion["mensaje"],
        'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);  
    }
    public function validar_cliente($request){
        $mensaje=[];
        $validacion=true;

        if($request->id_cliente!=0){

            $duplicado_cliente=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tcliente c where c.id_persona = ? and c.id_cliente != ? ',[$request->id_persona,$request->id_cliente]);
            if((int)($duplicado_cliente[0]->cantidad)>0){
                array_push($mensaje,'El campo persona ya esta registrado');
                $validacion=false;
            }
           
        }
        else{

            $duplicado_cliente=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tcliente c where c.id_persona = ?  ',[$request->id_persona]);

            if((int)($duplicado_cliente[0]->cantidad)>0){
                array_push($mensaje,'El campo persona ya esta registrado');
                $validacion=false;
            }

        }


        $arrayParametros=[
        'mensaje'=>$mensaje,
        'validacion'=>$validacion
        ];

        return $arrayParametros;
    }
    public function eliminar_cliente($id){

        db::update('delete from ras.tvehiculo where id_cliente = ? ',[$id]);
        db::update('delete from ras.tcliente where id_cliente = ? ',[$id]);

        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }
}