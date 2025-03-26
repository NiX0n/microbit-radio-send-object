
> Open this page at [https://nix0n.github.io/microbit-radio-send-object/](https://nix0n.github.io/microbit-radio-send-object/)

# Micro:bit Radio Send Object Extension

This extension extends the [built-in radio namespace](https://makecode.microbit.org/reference/radio) by providing new functions like `radio.sendObject()` and `radio.onReceivedObject()`.

The `radio.sendObject()` function depends on the built-in `radio.sendString()` function to send a JSON encoding of the passed value.  Micro:bit's built-in [radio.sendString()](https://makecode.microbit.org/reference/radio/send-string) has a limit of 19 characters.  To work around this, radio.sendObject() uses a combination of special control characters (STX, ETX) and maximally sized chunks sent by radio.sendString(); which allows for near limitless object size.

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/nix0n/microbit-radio-send-object** and import


## Import this project

To Import this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/nix0n/microbit-radio-send-object** and click import

## Usage

### `radio.sendObject(value)`

Send object over radio

**PARAMETERS**

* `value`: `any` - Object to be sent

**RETURNS**

void

**EXAMPLE**
```typescript
radio.sendObject({ foo: 'bar', baz: true })
```

### `radio.onReceivedObject(cb)`

Register event handler to listen for received object

**PARAMETERS**

* `cb` : `(receivedObject, props) => void` - Callback
    - `receivedObject`: `any` - Object sent over radio
    - `props`: `number[]` - List of packet properties accessable using [RadioPacketProperty.* enumeration](https://makecode.microbit.org/reference/radio/received-packet)

**RETURNS**

void

**EXAMPLE**
```typescript
radio.onReceivedObject(function (receivedObject: any, props: number[]) {
    console.log(`Object received: ${JSON.stringify(receivedObject)}`)
})
```


## Other
#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
