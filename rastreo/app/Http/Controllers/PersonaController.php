<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class PersonaController extends Controller
{

    public function lista_persona(Request $request)
    {

        $ruta_imagen_usuario = "";
        //$ruta_imagen_usuario = "http://".request()->server('SERVER_ADDR').":90/public/imagenes/usuarios/";



        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $usuarios=DB::select("select    distinct
                                        p.id_persona,
                                        p.nombre,
                                        p.apellido_paterno,
                                        p.apellido_materno,
                                        p.celular,
                                        p.telefono,
                                        p.ci
                                from ras.tpersona p
                                left join segu.users us on us.id_persona=p.id_persona
                                where p.estado=? and ".$ids." order by p.id_persona desc
                            ",["activo"]);
                        
                            
        $arrayParametros=[
            'personas'=>$usuarios
        ];

        return response()->json($arrayParametros);
    }
    public function post_persona(Request $request){
      
        $validacion = $this->validar_persona($request);
        if($request->id_persona==0){
          if((bool)$validacion["validacion"]==true){
            DB::insert('insert into ras.tpersona (nombre,estado,apellido_paterno,apellido_materno,ci,celular,telefono) values(?,?,?,?,?,?,?);',[$request->nombre,"activo",$request->apellido_paterno,$request->apellido_materno,$request->ci,$request->celular,$request->telefono ]);
          }
        }
        else{
          if((bool)$validacion["validacion"]==true){
            DB::update('update ras.tpersona set nombre =?,estado=?,apellido_paterno=?,apellido_materno=?,ci=?,celular=?,telefono=? where id_persona=?;',[$request->nombre,"activo",$request->apellido_paterno,$request->apellido_materno,$request->ci,$request->celular,$request->telefono,$request->id_persona]);
          }
        } 
  
        $arrayParametros=[
          'mensaje'=>$validacion["mensaje"],
          'validacion'=>$validacion["validacion"],
        ];
  
        return response()->json($arrayParametros);
    }
    public function validar_persona($request){
        $mensaje=[];
        $validacion=true;
        if($request->id_persona!=0){
            $duplicado_persona=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.tpersona p 
                                      where  trim(upper(p.ci))=trim(upper(?)) and p.id_persona != ? and p.estado=? ',[$request->ci,$request->id_persona,"activo"]);
            if((int)($duplicado_persona[0]->cantidad)>0){
                array_push($mensaje,'El campo cedula de identidad ya esta registrado');
                $validacion=false;
            }
           
        }
        else{
            $duplicado_persona=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.tpersona p
                                      where  trim(upper(p.ci))=trim(upper(?)) and p.estado=? ',[$request->ci,"activo"]);
            if((int)($duplicado_persona[0]->cantidad)>0){
                array_push($mensaje,'El campo cedula de identidad ya esta registrado');
                $validacion=false;
            }
        }
        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
    public function eliminar_persona($id){
        db::update('update ras.tpersona set estado=? where id_persona=? ',["inactivo",$id]);
    
        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
      }
    

}