<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class PassportAuthController extends Controller
{
    /**
     * Registration
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|min:4',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
 
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);
       
        $token = $user->createToken('LaravelAuthApp')->accessToken;
 
        return response()->json(['token' => $token], 200);
    }
 
    /**
     * Login
     */
    public function login(Request $request)
    {
        $data = [
            'email' => $request->email,
            'password' => $request->password
        ];
 
        if (auth()->attempt($data)) {
            $token = auth()->user()->createToken('rastreo')->accessToken;
            return response()->json(['token' => $token], 200);
        } else {
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }
    public function iniciar_sesion(Request $request)
    {
        
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ]);
   
        $credentials = request(['email', 'password']);
        if(!Auth::attempt($credentials))
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);

        $user = $request->user();
        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;
        if ($request->remember_me)
            $token->expires_at = Carbon::now()->addWeeks(1);
        $token->save();

        
        // $this->get_accesos($request->user()->id);
       
        $ruta_imagen_usuario = "http://".request()->server('SERVER_ADDR')."/public/imagenes/usuarios/";
        //$ruta_imagen_usuario = "http://"."localhost/rastreo"."/public/imagenes/usuarios/";
        $usuario=DB::select("select
                                 us.name as usuario,
                                 us.email as correo,
                                 ?||us.foto as foto,
                                 p.nombre||' '||p.apellido_paterno as persona
                                from segu.users us
                                join ras.tpersona p on p.id_persona=us.id_persona
                                where us.id = ?
                            ",[$ruta_imagen_usuario,$request->user()->id]);


        if($this->es_admin($request->user()->id)==true){
            $sesion=false;
        }else{
            $sesion=true;
        }
        return response()->json([
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
                $tokenResult->token->expires_at
            )->toDateTimeString(),
            'accesos' =>  $this->get_menu($request),
            'usuario'=>$usuario[0],
            'sesion'=>$sesion
        ]);
        
    }
    public function get_menu(Request $request){
     
        /*$request = request();      //obtencio de token
        $token = $request->bearerToken();*/

           
        $json = $this->get_menu_json($request->user()->id);   
        //return  $json[0]->json_tree;
        $arrayParametros=[
            'menu'=>response()->json($json[0]->json_tree)
        ];

        return response()->json($json[0]->json_tree);
    }
    public function get_menu_json($id){
 
        $id_permisos=DB::select("select  array_to_string( ARRAY_AGG ( array_to_string (r.id_permisos, ?, ?) ),? )::varchar  as id_permisos
        from segu.users u
        join ras.tusuario_rol ur on ur.id_usuario=u.id
        join ras.trol r on r.id_rol=ur.id_rol
        where u.id=? and array_to_string (r.id_permisos, ?, ?) !=? ",[",","0",",",$id,",","0",""]); 

        if($this->es_admin($id)==true){
          $ids="";
        }else{
          $ids="and c.id_permiso in (".$id_permisos[0]->id_permisos.")";
        }
        
        $my_array=DB::select("with recursive primer as (select c.id_permiso as data,
                            c.id_padre,
                            c.nombre_acceso as label,
                            c.icono_sidebar as icon ,
                            c.ruta_menu_sidebar as ruta_menu_sidebar,
                            
                            0 as lvl,
                            c.id_permiso as key ,
                            c.expandedicon,
                            c.collapsedicon

                    from segu.tpermiso c
                    
                    where c.id_padre is null  
                    ".$ids."

                    union all    
                    select  c.id_permiso as data, 
                            c.id_padre,
                            c.nombre_acceso as label,
                            c.icono_sidebar as icon,
                            c.ruta_menu_sidebar as ruta_menu_sidebar,
                            pr.lvl + 1 as lvl,
                            c.id_permiso as key ,
                            c.expandedicon,
                            c.collapsedicon

                    from segu.tpermiso c
                    inner join primer pr ON pr.data = c.id_padre  
                    ".$ids."

                    ),


                    maxlvl as ( select max(lvl) 
                            maxlvl 
                    from primer),
                    segundo as (
                    select primer.*, 
                    jsonb '[]' items
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
                    c.icon,
                    c.ruta_menu_sidebar,
                    c.lvl,
                    c.key, 
                    c.expandedicon,
                    c.collapsedicon,
                    jsonb '[]' items
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
    public function cerrar_sesion(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function get_usuarios(Request $request)
    {

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $ruta_imagen_usuario = "";
        //$ruta_imagen_usuario = "http://".request()->server('SERVER_ADDR').":90/public/imagenes/usuarios/";
        $usuarios=DB::select("
                        WITH pagos as(
                            select 
                            ps.id_servicio,
                            max(ps.fecha_fin)::TIMESTAMP as fecha_fin 
                            from ras.tpago_servicio ps 
                            group by ps.id_servicio)
                                select
                                 us.id as id_usuario,
                                 us.name as usuario,
                                 us.email as correo,
                                 ?||us.foto::varchar as foto,
                                 p.nombre||' '||p.apellido_paterno||' '||p.apellido_materno as persona,
                                 pag.fecha_fin::date

                                from segu.users us
                                left join ras.tpersona p on p.id_persona=us.id_persona

                                left join ras.tcliente c on c.id_persona=p.id_persona
                                left join ras.tservicio s on s.id_cliente=c.id_cliente
                                left join pagos pag on pag.id_servicio=s.id_servicio
                                where ".$ids." and us.estado=?
                            ",[$ruta_imagen_usuario,"activo"]);

        $roles=DB::select("select 
                 r.id_rol,
                 r.nombre_rol 
                 from ras.trol r
                    ");

        $arrayParametros=[
            'usuarios'=>$usuarios,
            'roles'=>$roles
        ];

        return response()->json($arrayParametros);
    }
    public function get_usuario($id)
    {

        $usuario=DB::select("select
                                 us.id as id_usuario,
                                 us.name as usuario,
                                 us.email as correo,
                                 us.foto,
                                 p.nombre||' '||p.apellido_paterno||' '||p.apellido_materno as persona,
                                 us.id_persona
                                from segu.users us
                                join ras.tpersona p on p.id_persona=us.id_persona
                                where us.id = ?
                            ",[$id]);

        $roles=DB::select("select 
                 r.id_rol,
                 r.nombre_rol 
                 from ras.trol r
                 where r.estado=? ",["activo"]);

        $id_usuario = 0;
        if($id!=0){
             $id_usuario = $usuario[0]->id_usuario;
        }

        $usuario_rol=DB::select("select 
                us.id_rol,
                r.nombre_rol
                from ras.tusuario_rol us
                join ras.trol r on r.id_rol=us.id_rol 
                join segu.users u on u.id=us.id_usuario
                where us.id_usuario = ?
                    ",[$id_usuario]);

        $personas=DB::select("select 
                    p.id_persona,
                    p.nombre,
                    p.apellido_paterno,
                    p.apellido_materno,
                    p.ci,
                    p.celular
                    from ras.tpersona p
                    where p.estado = ? ",["activo"]);
        
        $usuario_persona=DB::select("select 
                    p.id_persona,
                    p.nombre,
                    p.apellido_paterno,
                    p.apellido_materno,
                    p.ci,
                    p.celular
                    from ras.tpersona p
                    where p.estado = ? and p.id_persona = ? ",["activo", ($id==0) ? $id : $usuario[0]->id_persona ]);

        $arrayParametros=[
            'usuario'=>$usuario,
            'roles'=>$roles,
            'usuario_rol'=>$usuario_rol,
            'personas'=>$personas,
            'usuario_persona' => $usuario_persona
        ];

        return response()->json($arrayParametros);
    }
    public function post_usuario(Request $request){

        $validacion = $this->validar_usuario($request);

        if($request->id_usuario==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into segu.users (name,password,estado,id_persona,email,created_at)  values (?,?,?,?,?,now())',[$request->usuario,bcrypt($request->contrasena),"activo",(int)$request->id_persona,$request->correo]);
                $id_usuario=DB::select('select max(u.id)::integer as id_usuario from segu.users u');
                $this->guardar_usuario_rol($request->id_roles,$id_usuario[0]->id_usuario);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){
                DB::update('update segu.users set name=?,estado=?,id_persona=?,email=?,updated_at=now() where id=? ',
                [$request->usuario,"activo",(int)$request->id_persona,$request->correo ,(int)$request->id_usuario]);
                
                if($request->contrasena!=""){
                    DB::update('update segu.users set password =? where id=? ',
                    [bcrypt($request->contrasena),(int)$request->id_usuario]);
                }
                $id_usuario=DB::select('select u.id::integer as id_usuario from segu.users u where u.id=?',[$request->id_usuario]);
                $this->guardar_usuario_rol($request->id_roles,$id_usuario[0]->id_usuario);
            }
        }

        $arrayParametros=[
        'mensaje'=>$validacion["mensaje"],
        'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);  
    }
    public function guardar_usuario_rol($roles,$id_usuario){
        $longitud = count($roles);
        DB::delete("delete from ras.tusuario_rol where id_usuario = ? ",[$id_usuario]);
        for($i=0; $i<$longitud; $i++){      
            DB::insert('insert into ras.tusuario_rol (id_rol,id_usuario) values(?,?)',[$roles[$i]["id_rol"],$id_usuario]);
        }
    }

    public function validar_usuario($request){
        $mensaje=[];
        $validacion=true;

        if($request->id_usuario!=0){

            $duplicado_usuario=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from segu.users u 
                                      where  trim(upper(u.name))=trim(upper(?)) and u.id != ? and u.estado=? ',[$request->usuario,$request->id_usuario,"activo"]);
            if((int)($duplicado_usuario[0]->cantidad)>0){
                array_push($mensaje,'El campo usuario ya esta registrado');
                $validacion=false;
            }

            $duplicado_correo=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from segu.users u 
                                      where  trim(upper(u.email))=trim(upper(?)) and u.id != ? and u.estado=? ',[$request->correo,$request->id_usuario,"activo"]);
            if((int)($duplicado_correo[0]->cantidad)>0){
                array_push($mensaje,'El campo correo ya esta registrado');
                $validacion=false;
            }
           
        }
        else{

            $duplicado_usuario=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from segu.users u 
                                      where  trim(upper(u.name))=trim(upper(?))  and u.estado=? ',[$request->usuario,"activo"]);

            if((int)($duplicado_usuario[0]->cantidad)>0){
                array_push($mensaje,'El campo usuario ya esta registrado');
                $validacion=false;
            }

            $duplicado_correo=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from segu.users u 
                                      where  trim(upper(u.email))=trim(upper(?)) and u.estado=? ',[$request->correo,"activo"]);
            
            if((int)($duplicado_correo[0]->cantidad)>0){
                array_push($mensaje,'El campo correo ya esta registrado');
                $validacion=false;
            }

        }


        $arrayParametros=[
        'mensaje'=>$mensaje,
        'validacion'=>$validacion
        ];

        return $arrayParametros;
    }
    public function eliminar_usuario($id){
        db::update('update segu.users set estado=? where id=? ',["inactivo",$id]);

        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }


}