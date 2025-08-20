export type Workflow = {
    id: number;
    name?: string;
    objectTypeCode?: string;
    stateFieldName?: string;
    description?: string; //nullable
    workflowMatrices: Array<WorkflowMatrix>;
    workflowStates: Array<WorkflowState>;
};

export type WorkflowMatrix = {
    id: number;
    priority: number;
    stateStart?: string;
    stateStartNavigation?: WorkflowState;
    stateEnd?: string;
    stateEndNavigation?: WorkflowState;
};

export type WorkflowState = {
    id?: string;
    parentId?: string; //nullable
    name?: string;
    priority?: number;
    level?: number;
    parent?: WorkflowState;
    inverseParent?: Array<WorkflowState>;
    value?: number;
};

export type StateType<T> = {
    [K in keyof T]?: T[K] extends Array<infer U> ? Array<StateType<U>> : T[K];
};
