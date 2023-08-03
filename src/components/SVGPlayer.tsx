import React, { useState, useEffect, useRef, forwardRef } from 'react';
import WebView from 'react-native-webview';

type SVGPlayerProps = {
    svg: SVG,
    state: {
        direction?: number,
        fill?: number,
        fps?: number,
        isAlternate?: bool,
        iterations?: number,
        speed?: number
    },
    onPlayerMessage: (event: any) => void,
    play?: boolean,
    pause?: boolean,
    restart?: boolean,
    reverse?: boolean,
    toggle?: boolean,
    stop?: boolean
};

const defaultProps = {
    svg: null,
    state: {},
    onPlayerMessage: () => { },
    play: false,
    pause: false,
    restart: false,
    reverse: false,
    toggle: false,
    stop: false
};

const SVGPlayer = forwardRef((props: SVGPlayerProps, ref) => {
    const playerJSVarName = "player";
    const defaultState = {
        direction: 1,
        fill: 1,
        fps: 100,
        isAlternate: false,
        iterations: 1,
        speed: 1,
    };

    const [state, setState] = useState({ ...defaultState, ...props.state });
    const webViewRef = useRef(null);

    useEffect(() => {
        if (props.svg) {
            webViewRef.current = props.svg;
        }
    }, [props.svg]);

    useEffect(() => {
        if (props.play) {
            sendPlayerCommand(`${playerJSVarName}.play()`);
        }
        if (props.pause) {
            sendPlayerCommand(`${playerJSVarName}.pause()`);
        }
        if (props.restart) {
            sendPlayerCommand(`${playerJSVarName}.restart()`);
        }
        if (props.reverse) {
            sendPlayerCommand(`${playerJSVarName}.reverse()`);
        }
        if (props.toggle) {
            sendPlayerCommand(`${playerJSVarName}.toggle()`);
        }
        if (props.stop) {
            sendPlayerCommand(`${playerJSVarName}.stop()`);
        }
    }, [props.play, props.pause, props.restart, props.reverse, props.toggle, props.stop]);

    useEffect(() => {
        for (const [key, value] of Object.entries(state)) {
            if (props.initialState[key] !== value) {
                set(key, value);
            }
        }
    }, [state, props.initialState]);

    const sendPlayerCommand = (command: string) => {
        const jsCommand = `
            ${playerJSVarName} = document.querySelector('svg').svgatorPlayer;
            if (${playerJSVarName}) {
                ${command};
            }
            true;
        `;
        webViewRef.current?.injectJavaScript(jsCommand);
    };

    const set = (property: string, value: string | any) => {
        const valueString = typeof value === 'string' ? `'${value}'` : value;
        sendPlayerCommand(`${playerJSVarName}.set('${property}', ${valueString})`);
    };

    // return (
    //     <WebView ref={webViewRef} onMessage={props.onPlayerMessage} />
    // );
    return React.createElement(props.svg as any, { ref: webViewRef, onMessage: props.onPlayerMessage });
});

SVGPlayer.propTypes =
    SVGPlayer.defaultProps = 

export default SVGPlayer;
