import { getMatrixRows } from '../getMatrixRows';

describe('getMatrixRows', () => {
    it('should return matrix rows when workflow, explicitMatrices, and inheritMatrices are valid', () => {
        const workflow = {
            workflowMatrices: [
                {
                    id: 1,
                    stateStartNavigation: { name: 'start' },
                    stateEndNavigation: { name: 'end' },
                },
                {
                    id: 2,
                    stateStartNavigation: { name: 'start' },
                    stateEndNavigation: { name: 'end' },
                },
                {
                    stateStartNavigation: { name: 'start' },
                    stateEndNavigation: { name: 'end' },
                },
            ],
        };
        const explicitMatrices = [1];
        const inheritMatrices = [2];
        const result = getMatrixRows(workflow, explicitMatrices, inheritMatrices);
        expect(result).toEqual([
            {
                id: 1,
                stateStart: 'start',
                stateEnd: 'end',
                explicitChecked: true,
                inheritChecked: false,
            },
            {
                id: 2,
                stateStart: 'start',
                stateEnd: 'end',
                explicitChecked: false,
                inheritChecked: true,
            },
        ]);
    });
});
