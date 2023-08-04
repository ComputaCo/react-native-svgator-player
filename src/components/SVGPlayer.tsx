import React from "react";
import { Component } from "react";
import WebView from "react-native-webview";
import SVG from "../SVG";
import sleep from "../utils/sleep";
import { OptionalFields } from "../utils/types";

interface SVGPlayerCommonProperties {
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

interface SVGPlayerProps extends OptionalFields<SVGPlayerCommonProperties> {
    /** @property {SVG} svg - The actual svg js export from SVGator to render */
    svg: SVG;
}

interface SVGPlayerState extends SVGPlayerCommonProperties {
    /** @property {SVG} svg - The actual svg js export from SVGator to render */
    svg: SVG;
}

const defaultSVGPlayerState: SVGPlayerState = {
    direction: 1,
    fill: 1, // 1 for forwards as the default fill mode
    fps: 100, // 100 frames per second as the default frame rate
    isAlternate: false,
    iterations: 2, // 1 iteration as the default value
    speed: 1, // 100% normal speed as the default animation speed
    svg: null as any // this should be provided in the constructor
};

export default class SVGPlayer extends Component<SVGPlayerProps, SVGPlayerState> {

    state: SVGPlayerState

    private ref: React.RefObject<WebView>
    private playerJSVarName = "player"

    constructor(props: SVGPlayerProps) {
        super(props);
        this.ref = React.createRef<WebView>();
        this.state = { ...defaultSVGPlayerState, ...props }
    }

    componentDidUpdate(prevProps: SVGPlayerProps, prevState: SVGPlayerState) {
        // console.log('componentDidUpdate', prevProps, prevState, this.state)
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
        console.log(`${this.playerJSVarName}.set('${property}', ${valueString})`);
        // this.sendPlayerCommand(`${this.playerJSVarName}.set('${property}', ${valueString})`);
        this.sendPlayerCommand(`${this.playerJSVarName}.${property} = ${valueString}`);
    }

    /**
     * Detaches the player object from the SVG, removes event handlers, stops the animation, and resets to the first keyframe.
     * Further API calls will not have any effect.
     */
    public destruct() {
        this.sendPlayerCommand(`${this.playerJSVarName}.destruct()`);
    }

    async getCurrentTimeAsync(): Promise<number> {
        // this.getProperty('currentTime', cb);
        return await new Promise((resolve, reject) => {
            this.getProperty('currentTime', (value) => {
                resolve(value)
            })
        })
    }

    async getDurationAsync(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getProperty('duration', (value) => {
                resolve(value)
            })
        })
    }

    async getHasEndedAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getProperty('hasEnded', (value) => {
                resolve(value)
            })
        })
    }

    async getIsBackwardsAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getProperty('isBackwards', (value) => {
                resolve(value)
            })
        })
    }

    async getIsInfiniteAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getProperty('isInfinite', (value) => {
                resolve(value)
            })
        })
    }

    async getIsPlayingAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getProperty('isPlaying', (value) => {
                resolve(value)
            })
        })
    }

    async getIsReversedAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getProperty('isReversed', (value) => {
                resolve(value)
            })
        })
    }

    async getIsRollingBackAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getProperty('isRollingBack', (value) => {
                resolve(value)
            })
        })
    }

    async getPlayerStateAsync(): Promise<SVGPlayerState> {
        return new Promise((resolve, reject) => {
            this.getProperty('state', (value) => {
                resolve(value)
            })
        })
    }

    async getTotalTimeAsync(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getProperty('totalTime', (value) => {
                resolve(value)
            })
        })
    }

    get direction(): number {
        return this.state.direction
    }
    set direction(value: number) {
        this.setState({ direction: value })
    }
    get fill(): number {
        return this.state.fill
    }
    set fill(value: number) {
        this.setState({ fill: value })
    }
    get fps(): number {
        return this.state.fps
    }
    set fps(value: number) {
        this.setState({ fps: value })
    }
    get isAlternate(): boolean {
        return this.state.isAlternate
    }
    set isAlternate(value: boolean) {
        this.setState({ isAlternate: value })
    }
    get iterations(): number {
        return this.state.iterations
    }
    set iterations(value: number) {
        this.setState({ iterations: value })
    }
    get speed(): number {
        return this.state.speed
    }
    set speed(value: number) {
        this.setState({ speed: value })
    }
    get svg(): SVG {
        return this.state.svg
    }
    set svg(value: SVG) {
        this.setState({ svg: value })
    }


    private readPropCallbacks: { [key: string]: ((value: any) => void)[] } = {}

    private getProperty(property: string, callback: (value: any) => void) {
        // We inject JavaScript code into the WebView to get the property value 
        // and post it back to the React Native WebView. 
        // Note: This is an asynchronous operation.

        if (!this.readPropCallbacks[property]) {
            this.readPropCallbacks[property] = []
        }
        this.readPropCallbacks[property].push(callback)
        this.sendPlayerCommand(`
            var value = ${this.playerJSVarName}.${property};
            window.ReactNativeWebView.postMessage(JSON.stringify({ property: '${property}', value: value }));
        `);
    }

    private onPlayerMessage = (event: any) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.property) {
            // console.log('SET: ' + data.property + ' = ' + data.value);

            if (this.readPropCallbacks[data.property]) {
                this.readPropCallbacks[data.property].forEach(callback => callback(data.value))
                this.readPropCallbacks[data.property] = []
            } else {
                console.log(data.event + ' event occurred at offset ' + data.offset);
            }
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
        // console.log(jsCommand);
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
        return React.createElement(this.state.svg as any, {
            ref: this.ref,
            onMessage: this.onPlayerMessage
        });
    }
}