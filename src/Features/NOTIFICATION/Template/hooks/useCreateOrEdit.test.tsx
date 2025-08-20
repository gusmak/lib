import { renderHook, act } from '@testing-library/react';
import {
    useGetComponentInfo,
    useTemplate,
    useTemplateFormValidation,
    useTemplateFormHandlers,
    useTemplatePermissions,
    useTemplateFields,
} from './useCreateOrEdit';
import { checkValid, containsHtmlTags } from '../utils';
import { FormMode, TemplateContentType } from '../../enums';
import { useParams } from 'react-router';
import { Template } from '../types';
import { validateContainHtmlTag } from 'Features/SYSTEM/User/utils';

jest.mock('react-router', () => ({
    useParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
jest.mock('Features/SYSTEM/User/utils', () => ({
    validateContainHtmlTag: jest.fn(),
}));

jest.mock('../utils', () => ({
    checkValid: jest.fn(),
    containsHtmlTags: jest.fn(),
}));

beforeEach(() => {
    (validateContainHtmlTag as jest.Mock).mockReturnValue(true);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('useGetComponentInfo', () => {
    it('should return correct mode and templateId for edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        const { result } = renderHook(() => useGetComponentInfo());

        expect(result.current).toEqual({
            mode: FormMode.EDIT,
            templateId: 1,
        });
    });
    it('should return correct mode and templateId for create', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        const { result } = renderHook(() => useGetComponentInfo());

        expect(result.current).toEqual({
            mode: FormMode.CREATE,
            templateId: 0,
        });
    });
});

describe('useTemplate', () => {
    const mockGetById = jest.fn();
    const mockData: Template = {
        channelType: 'EMAIL',
        configType: 'OBJECT_ONLY',
        content: 'test content',
        id: 0,
        name: '',
        objectType: '',
        contentType: TemplateContentType.TEXT,
    };

    beforeEach(() => {
        mockGetById.mockImplementationOnce(({ onCompleted }) => {
            onCompleted({
                template: {
                    id: 0,
                    channelType: 'FILE',
                    configType: 'OBJECT_ONLY',
                    content: 'test content',
                    name: 'test template 1',
                    objectType: 'MEDIA_PLAN',
                    contentType: TemplateContentType.TEXT,
                },
            });
        });
        (containsHtmlTags as jest.Mock).mockReturnValue(true);
    });

    it('should initialize with correct states', () => {
        const { result } = renderHook(() => useTemplate(FormMode.CREATE, mockGetById));

        expect(result.current.templateInput).toBeUndefined();
        expect(result.current.confirmExit).toBeFalsy();
    });

    it('should update states when data changes', async () => {
        const { result } = renderHook(() => useTemplate(FormMode.EDIT, mockData, 1));

        await act(async () => {
            result.current.handleChangeContent('new content');
        });

        expect(result.current.templateInput?.content).toBe('new content');
    });
});

describe('useTemplateFormValidation', () => {
    const mockRef = { current: 0 };

    beforeEach(() => {
        (checkValid as jest.Mock).mockReturnValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should validate form correctly', () => {
        const { result } = renderHook(() =>
            useTemplateFormValidation(FormMode.CREATE, { content: 'test', objectType: 'TEST' }, true, true, mockRef)
        );

        expect(result.current.readyForSubmit).toBeTruthy();
    });
});

describe('useTemplateFormHandlers', () => {
    it('should handle content changes', () => {
        const mockSetTemplateInput = jest.fn();
        const mockSetContentValid = jest.fn();
        const mockSetConfirmExit = jest.fn();
        const mockSetTestingDataInput = jest.fn();

        const { result } = renderHook(() =>
            useTemplateFormHandlers(
                { contentType: 'TEXT' },
                mockSetTemplateInput,
                mockSetContentValid,
                mockSetConfirmExit,
                mockSetTestingDataInput,
                false
            )
        );

        act(() => {
            result.current.handleChangeContent('new content');
        });

        act(() => {
            result.current.handleChangeField({
                name: 'test',
            });
        });

        act(() => {
            result.current.handleTestingChanged({
                objectId: 1,
            });
        });

        expect(mockSetContentValid).toHaveBeenCalled();
        expect(mockSetTemplateInput).toHaveBeenCalled();
    });
});

describe('useTemplatePermissions', () => {
    const mockTemplate: Template = {
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    objectDefinition: {
                        fieldName: 'content',
                        fieldPath: '',
                        objectTypeCode: '',
                    },
                    permission: 15,
                },
            ],
        },
        id: 0,
        name: '',
        objectType: '',
        channelType: '',
        contentType: '',
        content: '',
        configType: '',
    };

    it('should set permissions correctly', () => {
        const { result } = renderHook(() => useTemplatePermissions(FormMode.EDIT, mockTemplate));

        expect(result.current.content).toBeTruthy();
    });
});

describe('useTemplateFields', () => {
    it('should return correct fields based on channel type', () => {
        const { result } = renderHook(() => useTemplateFields(FormMode.CREATE, { channelType: 'EMAIL' }, { content: true }));

        expect(result.current).toHaveLength(6);
    });
    it('should return correct fields based on channel type with mode EDIT', () => {
        const { result } = renderHook(() => useTemplateFields(FormMode.EDIT, { channelType: 'FILE' }, { content: true }));

        expect(result.current).toHaveLength(5);
    });
    it('should return correct fields based on channel type = EMAIL and mode EDIT', () => {
        const { result } = renderHook(() => useTemplateFields(FormMode.EDIT, { channelType: 'EMAIL' }, { content: true }));

        expect(result.current).toHaveLength(6);
    });
});
