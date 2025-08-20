import { checkValid, checkPermissionControl, containsHtmlTags, convertHtmlStringToElement, previewTemplate } from '../utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

jest.mock('html2canvas');
jest.mock('jspdf');

describe('checkValid', () => {
    it('should return false if currentObjectFilterInput is null', () => {
        expect(checkValid(null)).toBe(false);
    });

    it('should return true if currentObjectFilterInput is a valid object', () => {
        expect(checkValid({ id: '1', name: 'test' })).toBe(true);
    });

    it('should return true if currentObjectFilterInput channelType is EMAIL', () => {
        expect(checkValid({ id: '1', name: 'test', channelType: 'EMAIL' })).toBe(true);
    });
});

describe('checkPermissionControl ', () => {
    it('should return false', () => {
        expect(checkPermissionControl([{ id: 0 }], 0)).toBe(false);
        expect(
            checkPermissionControl(
                [{ id: 1, outputFieldPermission: { objectDefinitionWithPermissions: [{ objectDefinition: { fieldName: undefined } }] } }],
                1
            )
        ).toBe(false);
    });

    it('should return true', () => {
        expect(
            checkPermissionControl(
                [
                    {
                        id: 4,
                        outputFieldPermission: {
                            objectDefinitionWithPermissions: [{ objectDefinition: { fieldName: 'id' }, permission: 31 }],
                        },
                    },
                ],
                4
            )
        ).toBe(true);
    });
});

describe('containsHtmlTags', () => {
    it('should return false', () => {
        expect(containsHtmlTags('')).toBe(false);
        expect(containsHtmlTags('test')).toBe(false);
        expect(containsHtmlTags('test test')).toBe(false);
    });

    it('should return true', () => {
        expect(containsHtmlTags('<div>test</div>')).toBe(true);
        expect(containsHtmlTags('<div>test</div> <div>test</div>')).toBe(true);
    });
});

describe('convertHtmlStringToElement ', () => {
    it('should return a div element', () => {
        const htmlString = '<div>test</div>';
        const element = convertHtmlStringToElement(htmlString);
        expect(element.tagName).toBe('DIV');
    });
});

describe('previewTemplate', () => {
    const mockCanvas = {
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test'),
        height: 1000,
        width: 800,
    };

    const mockPdf = {
        internal: {
            pageSize: {
                getWidth: jest.fn().mockReturnValue(210),
                getHeight: jest.fn().mockReturnValue(297),
            },
        },
        addImage: jest.fn(),
        output: jest.fn().mockReturnValue(new Blob()),
    };

    beforeEach(() => {
        (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);
        (jsPDF as unknown as jest.Mock).mockImplementation(() => mockPdf);
        global.URL.createObjectURL = jest.fn();
    });

    it('should process template previewTemplate', async () => {
        const mockRef = { current: document.createElement('iframe') };
        await previewTemplate('<style></style>', mockRef);
    });

    it('should process template sas', async () => {
        const mockRef = { current: document.createElement('iframe') };
        await previewTemplate('<table><tbody><tr></tr></tbody></table>', mockRef);
    });

    it('should handle errors', async () => {
        const mockRef = { current: document.createElement('iframe') };
        (html2canvas as jest.Mock).mockRejectedValue(new Error('Error'));

        await previewTemplate('<div>Test</div>', mockRef);
    });
});
