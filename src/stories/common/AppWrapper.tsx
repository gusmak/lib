import { Provider } from 'jotai';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { AppProvider } from 'Utils';

/**
 * Wrapper for demo on storybook
 * Include BrowserRouter, I18nextProvider, jotaiRoot, AppProvider, SystemFeatureContext
 */
function AppWrapper({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <Provider>
                <AppProvider>{children}</AppProvider>
            </Provider>
        </BrowserRouter>
    );
}

export default AppWrapper;
