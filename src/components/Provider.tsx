import React, { useMemo } from 'react';
import { TimeslotsContext } from './Context';

/**
 *
 * @param param0.context a React.Context object
 * @param param0.children React sub components
 */
export function Provider({
    context,
    children,
}: {
    context: React.Context<any>;
    children: any;
}) {
    const contextValue = useMemo(() => ({}), []);
    const Context = context || TimeslotsContext;
    return (
        <Context.Provider value={contextValue}> {children} </Context.Provider>
    );
}
