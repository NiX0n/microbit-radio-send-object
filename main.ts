
radio.onReceivedString(function (receivedString) {
    let serialNumber = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    // initialize or append to receive buffer
    rxBuffer[serialNumber] = (rxBuffer[serialNumber] || "") + receivedString
    // Does the buffer start with an STX control character?
    if (rxBuffer[serialNumber].charCodeAt(0) == 2)
    {
        // Does the buffer end with an ETX control character?
        if (rxBuffer[serialNumber].charCodeAt(rxBuffer[serialNumber].length - 1) == 3)
        {
            // We're done; so we can strip the control characters off
            rxBuffer[serialNumber] = rxBuffer[serialNumber].slice(1,-1)
        }
        else
        {
            // We're NOT done; so don't parse and callback yet
            return;
        }
    }
    let obj = JSON.parse(rxBuffer[serialNumber])
    // reset receive buffer
    rxBuffer[serialNumber] = ''
    onRadioReceivedObject(obj, {'serial number': serialNumber})
})

function onRadioReceivedObject(obj: any, props: any)
{
    // log() for debugging
    console.log(obj)
}

function radioSendObject(obj: any)
{
    let data = JSON.stringify(obj);
    if(data.length > MAX_PACKET_LENGTH)
    {
        // If data is too long
        // Wrap it in control characters
        data = `\x02${data}\x03`
    }
    // Then chunk the string up and send it
    for(let p = 0; p < data.length; p += MAX_PACKET_LENGTH)
    {
        radio.sendString(data.substr(p, MAX_PACKET_LENGTH))
    }
}

// Test
input.onButtonPressed(Button.A, function() {
    radioSendObject({str: "thisisastringlongerthanapacket", arr: [1,2,3], bool: true})
})

// Constant must be same for all devices
let RADIO_GROUP: number = 11
// Constant maximum string length by radio.sendString()
let MAX_PACKET_LENGTH: number = 19
// Constant serial number of this device
let SERIAL_NUMBER: number = control.deviceSerialNumber()
// rxBuffer handles single streams from multiple devices
// indexed by serial number
let rxBuffer: string[] = []
// Send serialNumber for addressing
radio.setTransmitSerialNumber(true)
radio.setGroup(RADIO_GROUP)

// Handshake
radio.sendString("null")


basic.forever(function () {
	
})
