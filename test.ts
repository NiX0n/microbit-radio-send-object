radio.onReceivedObject(function (receivedObject: any, props: any) {
    if(receivedObject === null)
    {
        // Ignore Handshake
        return
    }
    let { echo, payload: testPayload } = receivedObject
    if(!testPayload)
    {
        throw 'Missing payload'
    }

    if(echo)
    {
        radio.sendObject({echo: false, payload : testPayload})
    }
    else
    {
        if (JSON.stringify(testPayload) != JSON.stringify(controlPayload))
        {
            throw 'Test payload does not match control'
        }
        isTestSuccess = true
    }
})

// Constant must be same for all devices
let RADIO_GROUP: number = 11
// Send serialNumber for addressing
radio.setTransmitSerialNumber(true)
radio.setGroup(RADIO_GROUP)
let controlPayload = { str: "thisisastringlongerthanapacket", arr: [1, 2, 3], bool: true }
let isTestSuccess = false

// Handshake to initialize second simulated device
radio.sendString("null")

// Wait for initialization
basic.pause(300)

radio.sendObject({ echo: true, payload: controlPayload })

basic.pause(300)

console.log(`Success: ${isTestSuccess ? 'yes' : 'no'}`)

if(!isTestSuccess)
{
    throw 'Test has failed for uknown reason'
}