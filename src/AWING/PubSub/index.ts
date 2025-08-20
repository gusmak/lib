let events: any[] = [];
let gUID = 0;

export const sub = (eventName: string, handler: Function, eventKey: string) => {
    const tempEvents = events.filter((e) => e.eventKey === eventKey);
    if (tempEvents.length > 0) {
        console.warn(
            'Event name ' +
                eventName +
                ' has the same eventKey value with ' +
                tempEvents[0].eventName +
                ' which is equal to ' +
                eventKey +
                '. Please choose another key instead!'
        );
    } else {
        const modifiedHandler = (evt: any) => {
            handler(evt.detail);
        };
        window.addEventListener(eventName, modifiedHandler);
        events.push({
            eventName,
            handler: modifiedHandler,
            eventKey,
        });
    }
};

export const pub = (eventName: string, value?: any) => {
    const e = new CustomEvent(eventName, { detail: value });
    window.dispatchEvent(e);
};

export const off = (eventKey: string) => {
    const e = events.find((e) => {
        return e.eventKey === eventKey;
    });
    if (e) {
        window.removeEventListener(e.eventName, e.handler);
        events = events.filter((e) => e.eventKey !== eventKey);
    }
};

export const getGUID = () => {
    return gUID;
};

export const updateGUID = () => {
    gUID = gUID + 1;
    return gUID;
};

export const getRandomKey = () => {
    return (Math.random() + 1).toString(36).substring(7);
};
