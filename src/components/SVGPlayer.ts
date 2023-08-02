import React from "react";
import { Component } from "react";
import WebView from "react-native-webview";
import OptionalFields from "../utils/OptionalFields";

interface SVGPlayerProps {
    svg: React.ForwardRefExoticComponent<React.RefAttributes<WebView>>
    initialState?: OptionalFields<SVGPlayerState>
}

interface SVGPlayerState {
    /** @property {number} direction - New: animation direction (1 == normal, -1 == reverse). */
    direction: number;

    /** @property {number} fill - New: animation fill mode (1 for forwards, -1 for backwards); if set to -1, animation will jump to its start once finished. */
    fill: number;

    /** @property {number} fps - New: Frame per seconds (default: 100). */
    fps: number;

    /** @property {boolean} isAlternate - True if the animation is set to alternate mode. */
    isAlternate: boolean;

    /** @property {number} iterations - The number of iterations or 0 for infinite playing. */
    iterations: number;

    /** @property {number} speed - New: Animation speed as a floating number, 1 representing 100% (normal speed). */
    speed: number;
}

const defaultSVGPlayerState: SVGPlayerState = {
    direction: 1,
    fill: 1, // 1 for forwards as the default fill mode
    fps: 100, // 100 frames per second as the default frame rate
    isAlternate: false,
    iterations: 1, // 1 iteration as the default value
    speed: 1, // 100% normal speed as the default animation speed
};

export default class SVGPlayer extends Component<SVGPlayerProps, SVGPlayerState> {

    state: SVGPlayerState;

    private forwardRef: React.ForwardRefExoticComponent<React.RefAttributes<WebView>>
    private ref: React.RefObject<WebView>
    // private element: React.ReactElement<any>
    private playerJSVarName = "player";

    constructor(props: SVGPlayerProps) {
        super(props);

        this.forwardRef = props.svg;
        this.ref = React.createRef<WebView>();
        // this.element = React.createElement(this.forwardRef, { ref: this.ref, onMessage: this.onPlayerMessage });

        this.state = { ...defaultSVGPlayerState, ...props.initialState }
    }

    componentDidUpdate(prevProps: SVGPlayerProps, prevState: SVGPlayerState) {
        for (const [key, value] of Object.entries(this.state)) {
            if (prevState[key as keyof SVGPlayerState] !== value) {
                this.set(key, value);
            }
        }
    }

    /**
     * Plays the current animation from the current offset, or restarts if it has ended.
     */
    public play() {
        this.sendPlayerCommand(`${this.playerJSVarName}.play()`);
    }

    /**
     * Pauses the current animation.
     */
    public pause() {
        this.sendPlayerCommand(`${this.playerJSVarName}.pause()`);
    }

    /**
     * Restarts the animation from its beginning.
     */
    public restart() {
        this.sendPlayerCommand(`${this.playerJSVarName}.restart()`);
    }

    /**
     * Reverses the playing direction and plays the animation.
     */
    public reverse() {
        this.sendPlayerCommand(`${this.playerJSVarName}.reverse()`);
    }

    /**
     * Toggles between play and pause.
     */
    public toggle() {
        this.sendPlayerCommand(`${this.playerJSVarName}.toggle()`);
    }

    /**
     * Alias for toggle.
     */
    public togglePlay() {
        this.sendPlayerCommand(`${this.playerJSVarName}.togglePlay()`);
    }

    /**
     * Stops the current animation and resets it to the first keyframe.
     */
    public stop() {
        this.sendPlayerCommand(`${this.playerJSVarName}.stop()`);
    }

    /**
     * Calls callback when the player is ready, passing the player as the first parameter.
     * @param {Function} callback - The callback function to be called when the player is ready.
     */
    public ready(callback: (player: any) => void) {
        this.sendPlayerCommand(`
            ${this.playerJSVarName}.ready(function(player) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'ready', player: player }));
            })
        `);
    }

    /**
     * Advances the animation to a given offset percentage.
     * @param {number} offsetPercent - The offset percentage to which the animation should be advanced.
     */
    public seek(offsetPercent: number) {
        this.sendPlayerCommand(`${this.playerJSVarName}.seek(${offsetPercent})`);
    }

    /**
     * Advances the animation by a given number of milliseconds.
     * @param {number} offsetMs - The number of milliseconds by which the animation should be advanced.
     */
    public seekBy(offsetMs: number) {
        this.sendPlayerCommand(`${this.playerJSVarName}.seekBy(${offsetMs})`);
    }

    /**
     * Advances the animation to a given number of milliseconds.
     * @param {number} offsetMs - The number of milliseconds to which the animation should be advanced.
     */
    public seekTo(offsetMs: number) {
        this.sendPlayerCommand(`${this.playerJSVarName}.seekTo(${offsetMs})`);
    }

    /**
     * Sets writable properties.
     * @param {string} property - The property to be set.
     * @param {any} value - The value to set.
     */
    public set(property: string, value: any) {
        const valueString = typeof value === 'string' ? `'${value}'` : value;
        this.sendPlayerCommand(`${this.playerJSVarName}.set('${property}', ${valueString})`);
    }

    /**
     * Detaches the player object from the SVG, removes event handlers, stops the animation, and resets to the first keyframe.
     * Further API calls will not have any effect.
     */
    public destruct() {
        this.sendPlayerCommand(`${this.playerJSVarName}.destruct()`);
    }

    get currentTime() {
        return this.getProperty('currentTime');
    }

    get duration() {
        return this.getProperty('duration');
    }

    get hasEnded() {
        return this.getProperty('hasEnded');
    }

    get isBackwards() {
        return this.getProperty('isBackwards');
    }

    get isInfinite() {
        return this.getProperty('isInfinite');
    }

    get isPlaying() {
        return this.getProperty('isPlaying');
    }

    get isReversed() {
        return this.getProperty('isReversed');
    }

    get isRollingBack() {
        return this.getProperty('isRollingBack');
    }

    get playerState() {
        return this.getProperty('state');
    }

    get totalTime() {
        return this.getProperty('totalTime');
    }

    private getProperty(property: string) {
        // We inject JavaScript code into the WebView to get the property value 
        // and post it back to the React Native WebView. 
        // Note: This is an asynchronous operation.
        this.sendPlayerCommand(`
            var value = ${this.playerJSVarName}.${property};
            window.ReactNativeWebView.postMessage(JSON.stringify({ property: '${property}', value: value }));
        `);
    }

    private onPlayerMessage = (event: any) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.property) {
            console.log(data.property + ' = ' + data.value);
        } else {
            console.log(data.event + ' event occurred at offset ' + data.offset);
        }
    }

    private sendPlayerCommand = (command: string) => {
        const jsCommand = `
        ${this.playerJSVarName} = document.querySelector('svg').svgatorPlayer;
        if (${this.playerJSVarName}) {
            ${command};
        }
        true;
        `;
        this.ref.current?.injectJavaScript(jsCommand);
    }

    /**
     * Attaches an event handler for the specified event.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The event handler function.
     */
    public on(eventName: string, callback: (offset: number) => void) {
        this.sendPlayerCommand(`
            ${this.playerJSVarName}.on('${eventName}', function(offset) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: '${eventName}', offset: offset }));
            });
        `);
    }

    /**
     * Detaches an event handler from the specified event.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The event handler function to remove.
     */
    public off(eventName: string, callback: (offset: number) => void) {
        this.sendPlayerCommand(`
            ${this.playerJSVarName}.off('${eventName}');
        `);
    }

    render(): React.ReactNode {
        // return this.element;
        return React.createElement(this.forwardRef as any, { ref: this.ref, onMessage: this.onPlayerMessage });
    }
}