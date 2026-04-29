<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class ParametrosController extends Controller{

    public function lista_departamento(Request $request)
    {
        $departamentos=DB::select("select id_departamento, nombre_departamento, fecha_reg::date, fecha_mod::date, id_usuario_reg, id_usuario_mod
        from ras.tdepartamento");

        $arrayParametros=[
            'departamentos'=>$departamentos
        ];
        return response()->json($arrayParametros);
    }
    public function post_departamento(Request $request){

        $validacion=$this->validar_departamento($request);
        $id_usuario=$request->user()->id;

        if($request->id_departamento==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into ras.tdepartamento(
                    nombre_departamento, fecha_reg,id_usuario_reg)
                    VALUES (?,now()::TIMESTAMP,?);',[$request->nombre_departamento,$id_usuario]);
            }
        }else{
            DB::update('update ras.tdepartamento set nombre_departamento=?, fecha_mod=?, id_usuario_mod=? where id_departamento=?',[$request->nombre_departamento,
            date("Y-m-d H:i:s"), $id_usuario,(int)$request->id_departamento]);
        
        }
        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"],
        ];
        return response()->json($arrayParametros);
    }
    public function validar_departamento($request){
        $mensaje=[];
        $validacion=true;
        // editar
        if($request->id_departamento!=0){
            $duplicado_departamento=DB::select('select 
            count(*)::integer as cantidad  
            from ras.tdepartamento d
            where trim(upper(d.nombre_departamento))=trim(upper(?)) and d.id_departamento != ?',[$request->nombre_departamento,$request->id_departamento]);
            if((int)($duplicado_departamento[0]->cantidad)>0){
                array_push($mensaje,'El nombre de departamento ya esta registrado');
                $validacion=false;
            }
        }
        else{
            $duplicado_departamento=DB::select('select 
                                                count(*)::integer as cantidad  
                                                from ras.tdepartamento d
                                                where trim(upper(d.nombre_departamento))=trim(upper(?))',[$request->nombre_departamento]);
            if((int)($duplicado_departamento[0]->cantidad)>0){
                array_push($mensaje,'El nombre de departamento ya esta registrado');
                $validacion=false;
            }                          
        }
        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
    public function lista_gestion(Request $request)
    {
        $gestiones=DB::select("select id_gestion, nombre_gestion, fecha_reg::date, fecha_mod::date, id_usuario_reg, id_usuario_mod
        from ras.tgestion");

        $arrayParametros=[
            'gestiones'=>$gestiones
        ];
        return response()->json($arrayParametros);
    }
    public function eliminar_departamento($id){
        db::update('update ras.tdepartamento set estado=? where id_departamento=? ',["inactivo",$id]);
    
        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
      }
}
