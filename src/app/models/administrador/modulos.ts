export interface ModulosO extends Array<ModulosO> {
    id:number,
    nombre:string,
    creation_time:Date,
    modification_time:Date
}

export interface asignarModuloRolI {
    id_rol:number,
    modulo:arrayModulo[]
}

export interface asignarModuloRolO {
    message: string,
    detail:string,
    error:string,
    status:number,
    body:[]
}

interface arrayModulo {
    id_modulo:number,
    evento:string
}


export interface moduloByIdRolO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:[]
}