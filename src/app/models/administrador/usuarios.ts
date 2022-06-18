export interface usuariosO{
    // id:number,
    // nombres:string,
    // ape_pat:string,
    // ape_mat:string,
    // correo:string,
    // telefono:string,
    // usuario:string,
    // clave:string,
    // creation_time:Date,
    // modification_time:Date,
    // id_rol:number,
    // estado:string

    message:string,
    detail:string,
    error:string,
    status:number,
    body:bodyUsuarioO
}

export interface bodyUsuarioO extends Array<bodyUsuarioO>{
    id:number,
    nombres:string,
    ape_pat:string,
    ape_mat:string,
    correo:string,
    telefono:string,
    usuario:string,
    clave:string,
    creation_time:Date,
    modification_time:Date,
    id_rol:number,
    estado:string
}

export interface crearUsuarioI {
    nombres:string,
    ape_pat:string,
    ape_mat:string,
    correo:string,
    telefono:string,
    usuario:string,
    clave:string,
    id_rol:number
}

export interface crearUsuarioO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:bodyCrearUsuarioO[]
}

interface bodyCrearUsuarioO {
    token : string,
    refreshToken: string
}

export interface usuarioByIdO extends Array<usuarioByIdO>{
    message:string,
    detail:string,
    error:string,
    status:number,
    body:bodyUsuarioByIdO[]
}

interface bodyUsuarioByIdO {
    id:number,
    nombres:string,
    ape_pat:string,
    ape_mat:string,
    correo:string,
    telefono:string,
    cargo:string,
    usuario:string,
    clave:string,
    creation_time:Date,
    modification_time:Date,
    id_rol:number,
    estado:string
}

export interface modificarUsuarioI {
    nombres:string,
    ape_pat:string,
    ape_mat:string,
    correo:string,
    telefono:string,
    cargo:string,
    isPrimerAprobador:string,
    isSegundoAprobador:string,
}

export interface modificarUsuarioO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:bodyModificarUsuarioO[]
}

interface bodyModificarUsuarioO {
    token : string,
    refreshToken: string
}


export interface modificarRolUsuarioI {
    id_rol:number
}

export interface modificarRolUsuarioO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:[]
}


export interface modificarEstadoUsuarioI {
    estado:number
}

export interface modificarEstadoUsuarioO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body:[]
}

