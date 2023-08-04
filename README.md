# react-native-svgator-player

`react-native-svgator-player` is a React Native library that provides a facade for playing SVG animations exported from [Svgator](https://www.svgator.com/).
The `SVGPlayer` class is a `React` component designed to control SVG animations. It utilizes properties and methods that allow you to define and manipulate SVG animations.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Properties](#properties)
- [Methods](#methods)
- [Examples](#examples)
- [License](#license)
- [Credits](#credits)

## Installation

```sh
npm install react-native-svgator-player
```

## Usage

```jsx
import SVGPlayer from "react-native-svgator-player";

export default (props) => {
  const svgPlayerRef = useRef(null);

  return (
    <View>
      <SVGPlayer ref={svgPlayerRef} svg={SVG} />
      <Button
        title="Play"
        onPress={() => {
          svgPlayerRef.current.play();
        }}
      />
    </View>
  );
};
```


## Properties

`SVGPlayer` uses two types of properties: `SVGPlayerCommonProperties` and `SVGPlayerState`.

### SVGPlayerCommonProperties

These are properties that control the animation's playback features.

| Property    | Type    | Description                                                                                                             |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| direction   | number  | Animation direction. 1 for normal, -1 for reverse                                                                       |
| fill        | number  | Animation fill mode. 1 for forwards, -1 for backwards. If set to -1, the animation will jump to its start once finished |
| fps         | number  | Frames per second. Default value is 100                                                                                 |
| isAlternate | boolean | If true, the animation alternates between forwards and backwards                                                        |
| iterations  | number  | The number of iterations or 0 for infinite playing                                                                      |
| speed       | number  | Animation speed as a floating number, 1 represents 100% (normal speed)                                                  |

### SVGPlayerState

`SVGPlayerState` extends `SVGPlayerCommonProperties` and adds the `svg` property.

| Property | Type | Description                                     |
| -------- | ---- | ----------------------------------------------- |
| svg      | SVG  | The actual svg js export from SVGator to render |

## Methods

Below is a list of all available `SVGPlayer` methods. 

### Playback Control Methods

| Method    | Arguments | Description                                                                      |
| --------- | --------- | -------------------------------------------------------------------------------- |
| play()    | None      | Plays the current animation from the current offset, or restarts if it has ended |
| pause()   | None      | Pauses the current animation                                                     |
| restart() | None      | Restarts the animation from its beginning                                        |
| reverse() | None      | Reverses the playing direction and plays the animation                           |
| toggle()  | None      | Toggles between play and pause                                                   |
| stop()    | None      | Stops the current animation and resets it to the first keyframe                  |

### Animation Navigation Methods

| Method                      | Arguments                                                                         | Description                                              |
| --------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| seek(offsetPercent: number) | `offsetPercent` - The offset percentage to which the animation should be advanced | Advances the animation to a given offset percentage      |
| seekBy(offsetMs: number)    | `offsetMs` - The number of milliseconds by which the animation should be advanced | Advances the animation by a given number of milliseconds |
| seekTo(offsetMs: number)    | `offsetMs` - The number of milliseconds to which the animation should be advanced | Advances the animation to a given number of milliseconds |

### Event Handling Methods

| Method                                                     | Arguments                                                                                 | Description                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| on(eventName: string, callback: (offset: number) => void)  | `eventName` - The name of the event.<br>`callback` - The event handler function           | Attaches an event handler for the specified event  |
| off(eventName: string, callback: (offset: number) => void) | `eventName` - The name of the event.<br>`callback` - The event handler function to remove | Detaches an event handler from the specified event |

## Examples

Below are some examples of how to use the `SVGPlayer` class in a React functional component.

### Playing an animation

```jsx
import SVGPlayer from "react-native-svgator-player";

export default (props) => {
  const svgPlayerRef = useRef(null);

  return (
    <View>
      <SVGPlayer ref={svgPlayerRef} svg={yourSVG} />
      <Button
        title="Play"
        onPress={() => {
          svgPlayerRef.current.play();
        }}
      />
    </View>
  );
};
```

### Pausing an animation

```jsx
import SVGPlayer from "react-native-svgator-player";

export default (props) => {
  const svgPlayerRef = useRef(null);

  return (
    <View>
      <SVGPlayer ref={svgPlayerRef} svg={yourSVG} />
      <Button
        title="Pause"
        onPress={() => {
          svgPlayerRef.current.pause();
        }}
      />
    </View>
  );
};
```

### Setting a property

```jsx
import SVGPlayer from "react-native-svgator-player";

export default (props) => {
  const svgPlayerRef = useRef(null);

  useEffect(() => {
    svgPlayerRef.current.set('speed', 2); // doubles the speed of the animation
  }, []);

  return (
    <View>
      <SVGPlayer ref={svgPlayerRef} svg={yourSVG} />
    </View>
  );
};
```

### Handling an event

```jsx
import SVGPlayer from "react-native-svgator-player";

export default (props) => {
  const svgPlayerRef = useRef(null);

  useEffect(() => {
    svgPlayerRef.current.on('end', (offset) => {
      console.log(`Animation ended at offset ${offset}`);
    });
  }, []);

  return (
    <View>
      <SVGPlayer ref={svgPlayerRef} svg={yourSVG} />
    </View>
  );
};
```

Please note that `yourSVG` in the examples should be replaced with an actual SVG object.

## License

[MIT](./LICENSE.md)

## Credits

**`react-native-svgator-player` is not affiliated with Svgator.**

And if you want to spend 3x more on your subscription bills, check out [Lottie](https://airbnb.design/lottie/).
