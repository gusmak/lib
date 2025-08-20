import { Matrix } from '../components/WorkflowMatrix';
import { Workflow } from '../types';

export const getMatrixRows = (workflow: Workflow, explicitMatrices: number[], inheritMatrices: number[]) => {
    const result: Matrix[] = [];

    workflow.workflowMatrices?.forEach((matrix) => {
        if (matrix.id) {
            const temp: Matrix = {
                id: matrix.id,
                stateStart: matrix.stateStartNavigation?.name,
                stateEnd: matrix.stateEndNavigation?.name,
                explicitChecked: explicitMatrices.includes(matrix.id),
                inheritChecked: inheritMatrices.includes(matrix.id),
            };

            result.push(temp);
        }
    });

    return result;
};
