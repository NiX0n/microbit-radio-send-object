radio.onReceivedString(function (receivedString) {
    let serialNumber = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    rxBuffer[serialNumber] = (rxBuffer[serialNumber] || "") + receivedString
    if (rxBuffer[serialNumber].charCodeAt(0) == 2)
    {
        if (rxBuffer[serialNumber].charCodeAt(rxBuffer[serialNumber].length - 1) == 3)
        {
            rxBuffer[serialNumber] = rxBuffer[serialNumber].slice(1,-1)
        }
        else
        {
            return;
        }
    }
    let obj = JSON.parse(rxBuffer[serialNumber])
    rxBuffer[serialNumber] = ''
    onRadioReceivedObject(obj)
})

function onRadioReceivedObject(obj: any)
{
    console.log(obj)
}

function radioSendObject(obj: any)
{
    let data = JSON.stringify(obj);
    if(data.length > MAX_PACKET_LENGTH)
    {
        data = `\x02${data}\x03`
    }
    for(let p = 0; p < data.length; p += MAX_PACKET_LENGTH)
    {
        radio.sendString(data.substr(p, MAX_PACKET_LENGTH))
    }
}

// Test
input.onButtonPressed(Button.A, function() {
    radioSendObject({str: "thisisastringlongerthanapacket", arr: [1,2,3], bool: true})
})

let RADIO_GROUP: number = 11
let MAX_PACKET_LENGTH: number = 19
let SERIAL_NUMBER: number = control.deviceSerialNumber();
let rxBuffer: string[] = []
radio.setTransmitSerialNumber(true)
radio.setGroup(RADIO_GROUP)

// Handshake
radio.sendString("null")


basic.forever(function () {
	
})
