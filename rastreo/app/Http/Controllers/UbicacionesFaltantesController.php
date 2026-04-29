<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class UbicacionesFaltantesController extends Controller
{
    public function ubicaciones_faltantes(Request $request)
    {
        
        $coordenadas=DB::select("with position as(
            select 
            DISTINCT on (p.latitude,p.longitude,ev.type)
            p.id,p.latitude,p.longitude,p.address
                    from public.tc_positions p
                    left join public.tc_events ev on ev.positionid=p.id
                    where p.address is null
                    and (p.latitude !=0 or p.latitude is null)
                    and p.devicetime::date >= now()::date)
                    select 
                    p.id,p.latitude,p.longitude,p.address
                    from position p order by p.id asc limit 5 ");

        $ubicaciones=[];

        for ($i=0; $i < count($coordenadas); $i++) { 

            $address= $this->getDireccion($coordenadas[$i]->latitude,$coordenadas[$i]->longitude);
            // dd($res);
            DB::update("update public.tc_positions set address = ? where id = ? ",[$address,$coordenadas[$i]->id]);
            // $this->ubicaciones[$i]=$coordenadas[$i]->acceso; 
        }


        $arrayParametros=[
            'coordenadas'=>$coordenadas
        ];
        
        return response()->json($arrayParametros);

    }
    function getDireccion($RG_Lat,$RG_Lon)
    {
        $json = "https://nominatim.openstreetmap.org/reverse?format=json&lat=".$RG_Lat."&lon=".$RG_Lon."&zoom=27&addressdetails=1";
        $ch = curl_init($json);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0");
        $jsonfile = curl_exec($ch);
        curl_close($ch);
        $RG_array = json_decode($jsonfile,true);

        return str_replace("'", "", $RG_array['display_name']);

    }

}