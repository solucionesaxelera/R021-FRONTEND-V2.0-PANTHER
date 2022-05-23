export interface tableListarSolpeI {
    idField:string;
    nroreqField:string;
    areaField:string;
    fechaField:string;
    monedaField:string;
    centroField:string;
    descrSolpeField:string;
    estadoField:string;
    usuarioField:string;
    detalleField: tableListarSolpeDetalleI[]
}

interface tableListarSolpeDetalleI {
    itemField: string;
    presuField: string;
    mengeField: string;
    meinsField: string;
    descrField: string;
    matnrField: string;
    ccostoField: string;
    glField: string;
    punitField: string;
    totSinigvField: string;
}