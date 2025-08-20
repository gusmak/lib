import { changeToAlias } from '../text';

describe('changeToAlias', () => {
    it('should return an empty string for an not input', () => {
        expect(changeToAlias()).toBe('');
    });

    it('should return an empty string for an empty input', () => {
        expect(changeToAlias('')).toBe('');
    });

    it('should handle special characters', () => {
        expect(changeToAlias('Hello!@#')).toBe('hello');
    });

    it('should handle Vietnamese characters with accents', () => {
        expect(changeToAlias('Tôi là ChatGPT')).toBe('toi-la-chatgpt');
    });

    it('should handle uppercase letters', () => {
        expect(changeToAlias('Hello WORLD')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
        expect(changeToAlias('Hello   World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
        expect(changeToAlias('H@e#l$l%o^')).toBe('hello');
    });

    it('should handle a mix of all inputs', () => {
        expect(changeToAlias('   TÔI là ChatGPT@123!  ')).toBe('toi-la-chatgpt123');
    });
});
