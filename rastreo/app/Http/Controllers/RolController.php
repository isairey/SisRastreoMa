<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class RolController extends Controller
{

    public function lista_rol(Request $request)
    {
        $roles=DB::select("select 
                         r.id_rol,
                         r.nombre_rol,
                         r.fecha_reg::varchar,
                         r.fecha_mod::varchar
                         from ras.trol r
                          where r.estado = ?  ",["activo"]);

        $arrayParametros=[
            'roles'=>$roles
        ];
        
        return response()->json($arrayParametros);

    }
    public function get_rol($id)
    {
        
        $rol=DB::select("select 
                        r.id_rol,
                        r.nombre_rol 
                        from ras.trol r
                        where r.id_rol = ? and r.estado = ? ",[$id,"activo"]);


         $json = $this->get_menu(); 
         $json_permisos=$this->get_permisos($id);

        //return $json;
        $arrayParametros=[
            'rol'=>$rol,
            'menu'=>response()->json( $json[0]->json_tree),
            'permisos'=>response()->json( $json_permisos)
        ];
        
        return response()->json($arrayParametros);
    }
    function get_permisos($id){
        $my_array=DB::select("with roles as(
                              SELECT 
                              r.id_rol,
                              r.id_permisos
                              from ras.trol r
                            ),
                            permiso as(
                            select 
                            p.id_permiso as key
                            from segu.tpermiso p
                           -- where p.href = 1
                            )

                            select 
                             p.* as key
                            from permiso p
                            where  p.key::varchar  in (SELECT unnest(pp.id_permisos) FROM roles pp where pp.id_rol=? )
                                                        ",[$id]);
        return $my_array;
    }
    function get_menu() {

        $my_array=DB::select("with recursive primer as (select c.id_permiso as data,
                                c.id_padre,
                                c.nombre_acceso as label,
                                c.expandedicon as expandedIcon ,
                                c.collapsedicon as collapsedIcon,
                                
                                0 as lvl,
                                c.id_permiso as key 

                        from segu.tpermiso c
                        where c.id_padre is null
                        union all    
                        select  ch.id_permiso as data, 
                                ch.id_padre,
                                ch.nombre_acceso as label,
                                ch.expandedicon as expandedIcon,
                                ch.collapsedicon as collapsedIcon,
                                pr.lvl + 1 as lvl,
                                ch.id_permiso as key 

                        from segu.tpermiso ch
                        inner join primer pr ON pr.data = ch.id_padre  ),
                        maxlvl as ( select max(lvl) 
                                maxlvl 
                        from primer),
                        segundo as (
                        select primer.*, 
                        jsonb '[]' children
                        from primer, maxlvl
                        where lvl = maxlvl
                        union
                        (
                        select (pri).*, 
                        jsonb_agg(seg)
                        from (
                        select pri, 
                            seg
                        from primer pri
                        inner join segundo seg on seg.id_padre = pri.data
                        ) branch
                        group by branch.pri

                        union

                        select c.data,
                        c.id_padre,
                        c.label,
                        c.expandedIcon,
                        c.collapsedIcon,
                        c.lvl,
                        c.key, 
                        jsonb '[]' children
                        from   primer c
                        where  not  exists  (select 1 from primer pri where pri.id_padre = c.data)
                        )         
                        )
                        select jsonb_pretty(row_to_json( segundo )::jsonb) ::text json_tree
                        from segundo
                        where lvl = 0
                        order by  lvl;"); 

        return $my_array;

    }
    public function post_rol(Request $request){

        $validacion = $this->validar_rol($request);

        if($request->id_rol==0){
            if((bool)$validacion["validacion"]==true){
               DB::insert('insert into ras.trol (nombre_rol,estado,id_permisos,fecha_reg) values(?,?,?,now()::TIMESTAMP );',[$request->nombre_rol,"activo",'{'.$request->id_arbol.'}' ]);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){
               DB::update('update ras.trol set nombre_rol =?,id_permisos=?,fecha_mod=now()::TIMESTAMP where id_rol=?; ',[$request->nombre_rol,'{'.$request->id_arbol.'}',$request->id_rol]);
            }
        }

        $rol=DB::select("select 
                        r.id_rol,
                        r.nombre_rol 
                        from ras.trol r
                        ");

        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"],
            'rol'=>$rol
        ]; 

        return response()->json($arrayParametros);
        
    }
    public function validar_rol($request){
        $mensaje=[];
        $validacion=true;
        if($request->id_rol!=0){
            $dubicado_rol=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.trol r 
                                      where  trim(upper(r.nombre_rol))=trim(upper(?)) and r.id_rol != ? and r.estado=? ',[$request->nombre_rol,$request->id_rol,"activo"]);
            if((int)($dubicado_rol[0]->cantidad)>0){
                array_push($mensaje,'El nombre rol ya esta registrado');
                $validacion=false;
            }
           
        }
        else{
            $dubicado_rol=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.trol r
                                      where  trim(upper(r.nombre_rol))=trim(upper(?)) and r.estado=? ',[$request->nombre_rol,"activo"]);
            if((int)($dubicado_rol[0]->cantidad)>0){
                array_push($mensaje,'El nombre rol ya esta registrado');
                $validacion=false;
            }
        }
        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
    public function eliminar_rol($id){
        db::update('update  ras.trol set estado=? where id_rol=? ',["inactivo",$id]);

        $roles=DB::select("select 
                         r.id_rol,
                         r.nombre_rol 
                         from ras.trol r
                          where r.estado = ?  ",["activo"]);

        $arrayParametros=[
            'roles'=>$roles
        ];
        
        return response()->json($arrayParametros);
    }

    

}