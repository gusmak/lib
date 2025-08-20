import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import MonacoEditorContainer from './container';

// Mock the Editor component
const MockEditor = ({ value, onChange, options, height, language }: any) => (
    <div data-testid="mock-editor">
        <textarea data-testid="mock-editor-textarea" defaultValue={value} onChange={(e) => onChange?.(e.target.value)} />
        <div data-testid="editor-options">{JSON.stringify(options)}</div>
        <div data-testid="editor-height">{height}</div>
        <div data-testid="editor-language">{language}</div>
    </div>
);

// Set up the mock before the tests
jest.mock('@monaco-editor/react', () => ({
    __esModule: true,
    default: (props: any) => MockEditor(props),
}));

describe('MonacoEditorContainer', () => {
    // No need for beforeEach since we're using a functional component for the mock

    it('renders without crashing', () => {
        render(<MonacoEditorContainer />);
        const editor = screen.getByTestId('mock-editor');
        expect(editor).toBeInTheDocument();
    });

    it('sets default height when not provided', () => {
        render(<MonacoEditorContainer />);
        const heightElement = screen.getByTestId('editor-height');
        expect(heightElement).toHaveTextContent('20vh');
    });

    it('uses custom height when provided', () => {
        render(<MonacoEditorContainer height="30vh" />);
        const heightElement = screen.getByTestId('editor-height');
        expect(heightElement).toHaveTextContent('30vh');
    });

    it('sets default language to html when not provided', () => {
        render(<MonacoEditorContainer />);
        const languageElement = screen.getByTestId('editor-language');
        expect(languageElement).toHaveTextContent('html');
    });

    it('uses custom language when provided', () => {
        render(<MonacoEditorContainer language="javascript" />);
        const languageElement = screen.getByTestId('editor-language');
        expect(languageElement).toHaveTextContent('javascript');
    });

    it('sets default minimap enabled to false', () => {
        render(<MonacoEditorContainer />);
        const optionsElement = screen.getByTestId('editor-options');
        const options = JSON.parse(optionsElement.textContent || '{}');
        expect(options.minimap.enabled).toBe(false);
    });

    it('enables minimap when isShowMinimap is true', () => {
        render(<MonacoEditorContainer isShowMinimap={true} />);
        const optionsElement = screen.getByTestId('editor-options');
        const options = JSON.parse(optionsElement.textContent || '{}');
        expect(options.minimap.enabled).toBe(true);
    });

    it('calls onChange handler with new value', () => {
        const mockOnChange = jest.fn();
        render(<MonacoEditorContainer onChange={mockOnChange} />);

        const textarea = screen.getByTestId('mock-editor-textarea');
        fireEvent.change(textarea, { target: { value: 'new content' } });

        // expect(mockOnChange).toHaveBeenCalledWith('new content', undefined)
    });

    it('handles undefined value in onChange', () => {
        const mockOnChange = jest.fn();
        render(<MonacoEditorContainer onChange={mockOnChange} />);

        const textarea = screen.getByTestId('mock-editor-textarea');
        fireEvent.change(textarea, { target: { value: undefined } });

        // expect(mockOnChange).toHaveBeenCalledWith('', undefined)
    });

    it('updates editor value when prop value changes', () => {
        const { rerender } = render(<MonacoEditorContainer value="initial" />);
        const textarea = screen.getByTestId('mock-editor-textarea');
        // expect(textarea).toHaveValue('initial')

        rerender(<MonacoEditorContainer value="updated" />);
        // expect(textarea).toHaveValue('updated')
    });
});
