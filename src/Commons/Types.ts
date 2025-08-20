export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: { [name: string]: any };
}
export interface AnalyticDataProviderModel {
    timeline: number;
    view: number;
    click: number;
    ctr: number;
}

export type Timestamp = {
    seconds: number;
    nanos?: number;
};

export type ObjectDefinition = {
    id: number;
    objectTypeCode?: string;
    fieldName?: string;
    fieldPath?: string;
    description?: string;
    isPrimaryKey?: boolean;
};
