import React from "react";
import TimeslotsContext from "./Context";
import { Provider } from "./Provider";

/**
 * Main Component of Time slots which provides all the functionality to manage slots
 * @param param0.context React.Context by default it will use the default Time slot context
 * @param param0.children child components of react 
 */
export function Timeslots({ context = TimeslotsContext, children }: { context: React.Context<any>, children: any }) {
    return <Provider context={context}>
        {children}
    </Provider>
}