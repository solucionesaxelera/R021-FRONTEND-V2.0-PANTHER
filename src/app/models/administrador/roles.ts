export interface rolesI extends Array<rolesI> {
    id:number,
    nombre:string,
    creation_time:Date,
    modification_time:Date
}

export interface crearRolI {
    nombre:string
}

export interface crearRolO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:[]
}


export interface modificarRolI {
    nombre:string
}

export interface modificarRolO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:[]
}


export interface obtenerRolByIdO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:bodyObtenerRolByIdO[]
    
}

interface bodyObtenerRolByIdO {
    id:number,
    nombre:string,
    creation_time:Date,
    modification_time:Date
}