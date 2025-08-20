import _ from 'lodash';
import {
    ConfigArrayEdit,
    ConfigResult,
    ParamConfiguration,
    WorkspaceSharingInputForm,
    type SharingWorkspace,
    type WorkspaceSharing,
    type Configuration,
    ObjectDataInputOfSharingWorkspaceConfigInput,
    ObjectDataInputOfSharingWorkspaceInput,
    SharingConfigParamType,
} from './Types';
import { type WorkspaceOption } from './Atoms';

export const checkValid = (cws?: WorkspaceSharing): boolean => {
    return !!(
        cws &&
        !_.isEmpty(cws?.name) &&
        !_.isEmpty(cws?.objectTypeCode) &&
        _.toNumber(_.get(cws, 'objectFilterId', -1)) >= 0 &&
        _.toNumber(_.get(cws, 'workspaceId', -1)) >= 0
    );
};

/** Lấy tất cả param trong dấu {}:
 * VD  any(o.MediaPlanApprovals, i.CustomerId = {CustomerId}) => return: ["CustomerId"]
 */
export const getAllStringsBetweenBraces = (input: string): string[] => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
        matches.push(match[1]);
    }

    return matches;
};

export const getFilterConfigurations = (valueArray: ConfigResult[]) => {
    const result: ParamConfiguration[] = [];

    _.each(valueArray, (item) => {
        result.push({
            id: _.toNumber(item.id),
            paramName: item.paramName,
            paramValue: item.paramValue,
        } as ParamConfiguration);
    });

    return result;
};

export const getNewConfigs = (configs: SharingWorkspace['sharingWorkspaceConfigs']) => {
    const result = [] as ObjectDataInputOfSharingWorkspaceConfigInput[];
    _.each(configs, (c) => {
        result.push({
            value: {
                id: c?.id,
                paramName: c?.paramName,
                paramType: c?.paramType,
                paramValue: c?.paramValue,
            },
        });
    });
    return result;
};

export const getWorkspaceConfigChanged = (
    oldWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'],
    newWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs']
) => {
    const newArray = [] as any[];
    _.each(newWorkspaceConfig, (w) => {
        const odlItem = _.find(oldWorkspaceConfig, (ow) => `${ow?.id}` === `${w?.id}`);

        if (odlItem) {
            if (w?.paramType === odlItem.paramType && (w?.paramName !== odlItem.paramName || w?.paramValue !== odlItem.paramValue)) {
                newArray.push({
                    id: _.toNumber(odlItem.id),
                    value: {
                        paramName: w.paramName,
                        paramValue: w.paramValue,
                    },
                });
            }
        } else {
            newArray.push({
                value: {
                    paramName: w?.paramName,
                    paramType: w?.paramType,
                    paramValue: w?.paramValue,
                },
            });
        }
    });

    _.each(oldWorkspaceConfig, (w) => {
        const deleteConfig = _.find(newWorkspaceConfig, (nw) => `${nw?.id}` === `${w?.id}`);
        if (!deleteConfig) {
            newArray.push({
                id: w?.id,
            });
        }
    });

    if (_.size(newArray)) return newArray;
    else return null;
};

export const getConfigCreating = (sharingWorkspace: SharingWorkspace[]) => {
    const addNewWorkspace: ObjectDataInputOfSharingWorkspaceInput[] = [];

    _.each(sharingWorkspace, (w) => {
        addNewWorkspace.push({
            value: {
                targetWorkspaceId: w.targetWorkspaceId,
                sharingWorkspaceConfigs: getNewConfigs(w.sharingWorkspaceConfigs),
            },
        });
    });

    return addNewWorkspace;
};

export const getDifferentWorkspace = (
    oldWorkspace: SharingWorkspace[],
    newWorkspace: SharingWorkspace[]
): ObjectDataInputOfSharingWorkspaceInput[] => {
    const addWorkspace = [] as SharingWorkspace[];
    const restWorkspace = [] as SharingWorkspace[];

    _.each(newWorkspace, (w) => {
        if ((w?.id ?? 0) < 0) {
            addWorkspace.push({ ...w });
        } else {
            restWorkspace.push(w);
        }
    });

    const editWorkspace = [] as ObjectDataInputOfSharingWorkspaceInput[];
    const addNewWorkspace = [] as ObjectDataInputOfSharingWorkspaceInput[];
    const removeWorkspace = [] as ObjectDataInputOfSharingWorkspaceInput[];

    _.each(restWorkspace, (w) => {
        const owConfig = _.find(oldWorkspace, (ow) => `${ow.id}` === `${w.id}`);
        if (owConfig) {
            const result = getWorkspaceConfigChanged(owConfig?.sharingWorkspaceConfigs, w.sharingWorkspaceConfigs);

            if (result) {
                editWorkspace.push({
                    key: _.toNumber(owConfig.id),
                    value: {
                        sharingWorkspaceConfigs: result,
                    },
                });
            }
        }
    });

    _.each(addWorkspace, (w) => {
        addNewWorkspace.push({
            value: {
                targetWorkspaceId: w.targetWorkspaceId,
                sharingWorkspaceConfigs: getNewConfigs(w.sharingWorkspaceConfigs),
            },
        });
    });

    _.each(oldWorkspace, (w) => {
        const deleteConfig = _.find(newWorkspace, (nw) => `${nw.id}` === `${w.id}`);
        if (!deleteConfig) {
            removeWorkspace.push({
                key: _.toNumber(w.id),
            });
        }
    });

    return [...editWorkspace, ...addNewWorkspace, ...removeWorkspace];
};

export const getDifferentFilter = (configArrayEdit: ConfigArrayEdit, filterConfiguration: ParamConfiguration[]) => {
    const result: any[] = [];

    const { newIds, removedIds } = computedConfigIds(configArrayEdit.FILTER, filterConfiguration);

    for (let i = 0; i < filterConfiguration.length; i++) {
        for (let j = 0; j < configArrayEdit.FILTER.length; j++) {
            if (filterConfiguration[i].id === configArrayEdit.FILTER[j].id) {
                const chosenValue = filterConfiguration[i].paramValue as string;
                if (chosenValue !== configArrayEdit.FILTER[j].paramValue) {
                    result.push({
                        id: filterConfiguration[i].id,
                        value: {
                            paramName: filterConfiguration[i].paramName,
                            paramType: SharingConfigParamType.Filter,
                            paramValue: chosenValue.toString(),
                        },
                    });
                }
            }
        }
        if (newIds.includes(filterConfiguration[i].id)) {
            result.push({
                id: 0,
                value: {
                    paramName: filterConfiguration[i].paramName,
                    paramType: SharingConfigParamType.Filter,
                    paramValue: filterConfiguration[i]?.paramValue?.toString(),
                },
            });
        }
    }

    // Đẩy các config bị xóa vào result để server biết là xóa
    for (let i = 0; i < removedIds.length; i++) {
        result.push({
            id: removedIds[i],
        });
    }

    return result;
};

export const isEmptyPayload = (obj?: Object | null): boolean => {
    // Kiểm tra nếu obj là null hoặc undefined
    if (obj === null || obj === undefined) {
        return true;
    }

    // Kiểm tra nếu obj không phải là object hoặc là một mảng
    if (typeof obj !== 'object' || Array.isArray(obj)) {
        return true;
    }

    // Kiểm tra nếu obj không có bất kỳ cặp key-value nào, hoặc nếu chỉ có một cặp key-value là workspaceSharingConfigs với mảng rỗng
    const obKeys = _.keysIn(obj);
    const configs = _.get(obj, 'workspaceSharingConfigs');

    return (
        _.size(obKeys) === 0 || (_.size(obKeys) === 1 && _.isArray(configs) && _.size(configs) === 0)

        // return Object.keys(obj).length === 0 ||
        // (Object.keys(obj).length === 1 &&
        //     Array.isArray(obj.workspaceSharingConfigs) &&
        //     obj.workspaceSharingConfigs.length === 0)
    );
};

export const computedConfigIds = (
    origin: any[],
    modified: any[]
): {
    newIds: (string | number)[];
    removedIds: (string | number)[];
} => {
    // Tạo một tập hợp chứa các id từ origin
    const idM = new Set(origin.map((item) => item.id));
    const idR = new Set(modified.map((item) => item.id));

    // Duyệt qua modified và tìm các id không có trong idSet
    const a = (bc: any[], ids: any) => {
        return bc.filter((item) => !ids.has(item.id)).map((item) => item.id);
    };

    return { newIds: a(modified, idM), removedIds: a(origin, idR) };
};

export const findAddedConfigIds = (origin: any[], modified: any[]): (string | number)[] => {
    // Tạo một tập hợp chứa các id từ origin
    const idSet = new Set(origin.map((item) => item.id));

    // Duyệt qua modified và tìm các id không có trong idSet
    const missingIds: (string | number)[] = modified.filter((item) => !idSet.has(item.id)).map((item) => item.id);

    return missingIds;
};

export const findRemovedConfigIds = (origin: any[], modified: any[]): (string | number)[] => {
    // Tạo một tập hợp chứa các id từ modified
    const idSet = new Set(modified.map((item) => item.id));

    // Duyệt qua modified và tìm các id không có trong idSet
    const removedIds: (string | number)[] = origin.filter((item) => !idSet.has(item.id)).map((item) => item.id);

    return removedIds;
};

export const isDisabledConfigTab = (sharing: WorkspaceSharingInputForm): boolean => {
    return !sharing.objectTypeCode || !sharing.objectFilterId;
};

export const getLowerCase = (str: string | string[]): string | string[] => {
    if (_.isArray(str)) return str.map((s) => s.toLowerCase());
    return str.toLowerCase();
};

export const workspaceCheckFilterValueConfigs = (workspaces: SharingWorkspace[]) => {
    let count = 0;
    let check = true;

    _.each(workspaces, (w) => {
        _.each(w?.sharingWorkspaceConfigs, (w) => {
            if (
                w?.paramType === SharingConfigParamType.Filter &&
                (w.paramValue === '' || w.paramValue === undefined || w.paramValue === null)
            ) {
                count++;
                check = false;
            }
        });
    });

    return { check, count };
};

export const getDefaultValues = (key: string, obj?: WorkspaceOption & { suppliers?: { id: number }[] }) => {
    if (!obj) return undefined;

    switch (key.toLowerCase()) {
        case 'workspaceId'.toLowerCase():
            return `${obj.id}`;
        case 'customerId'.toLowerCase():
            return `${obj.customerId}`;
        case 'supplierId'.toLowerCase():
            return `${_.get(obj, 'suppliers.0.id', '')}`;

        default:
            return undefined;
    }
};

export const getWorkspacesConfigByFilter = (
    workspaces: SharingWorkspace[],
    workspaceOptions: WorkspaceOption[],
    filterParams: string[]
) => {
    return _.map(_.cloneDeep(workspaces), (w) => {
        const nConfigs: Configuration[] = [];
        const restFilter: string[] = [];

        const currentWorkspace = _.find(workspaceOptions, (o) => {
            return `${o.id}` === `${w.targetWorkspaceId}`;
        });

        _.each(w.sharingWorkspaceConfigs, (c) => {
            if (c?.paramType === SharingConfigParamType.Filter) {
                if (_.includes(getLowerCase(filterParams), c?.paramName?.toLowerCase())) {
                    if (c) {
                        restFilter.push(c?.paramName ?? '');
                        nConfigs.push({
                            id: c.id,
                            paramName: c?.paramName ?? '',
                            paramValue: c.paramValue,
                            paramType: c.paramType,
                        });
                    }
                }
            } else {
                if (c) {
                    nConfigs.push({
                        id: c.id,
                        paramName: c?.paramName ?? '',
                        paramValue: c.paramValue,
                        paramType: c.paramType,
                    });
                }
            }
        });

        _.each(_.difference(getLowerCase(filterParams), getLowerCase(restFilter)), (r) => {
            nConfigs.push({
                id: Date.now(),
                paramName: filterParams[_.findIndex(getLowerCase(filterParams), (f) => f === r)],
                paramValue: getDefaultValues(r, currentWorkspace),
                paramType: SharingConfigParamType.Filter,
            });
        });

        return {
            ...w,
            sharingWorkspaceConfigs: nConfigs,
        };
    });
};

export const isSchemaEmpty = (schema: null | string | undefined | number) =>
    schema === null || schema === undefined || schema === '' || schema === -1;
