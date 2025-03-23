radio.onReceivedObject(function(receivedObject: any, props: any) {
    // log() for debugging
    console.log(receivedObject)
})

// Test
input.onButtonPressed(Button.A, function () {
    radio.sendObject({ str: "thisisastringlongerthanapacket", arr: [1, 2, 3], bool: true })
})

// Constant must be same for all devices
let RADIO_GROUP: number = 11
// Send serialNumber for addressing
radio.setTransmitSerialNumber(true)
radio.setGroup(RADIO_GROUP)

// Handshake
radio.sendString("null")


basic.forever(function () {
	
})
