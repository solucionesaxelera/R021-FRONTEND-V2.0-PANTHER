export interface accesoI {
    usuario : string,
    clave: string
}

export interface accesoO {
    message:string,
    detail:string,
    error:string,
    status:number,
    body: body
}

interface body {
    token : string,
    refreshToken: string
}