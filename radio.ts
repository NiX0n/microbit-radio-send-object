namespace radio {

/**
 * Constant maximum string length by radio.sendString()
 */
export let MAX_PACKET_LENGTH: number = 19

/**
 * Constant serial number of this device
 */
let SERIAL_NUMBER: number = control.deviceSerialNumber()

/**
 * rxBuffer handles single streams from multiple devices
 * indexed by serial number
 */
let rxBuffer: { [key: string]: string } = {}

/**
 * receivedObject: any, props: any
 */
let _onReceivedObject = (receivedObject: any, props: any) => {}

/**
 * Registers code to run when the radio receives an object.
 * Notice this will override any onReceivedString() callback
 */
export function onReceivedObject(cb: (receivedObject: any, props: any) => void)
{
    _onReceivedObject = cb
    _registerOnReceivedString()
}

/**
 * Send object serialized in JSON format over radio.
 * Chunks message into parts if over MAX_PACKET_LENGTH.
 * @param {any} obj Object to be sent over radio
 */
export function sendObject(obj: any)
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
        sendString(data.substr(p, MAX_PACKET_LENGTH))
    }
}

function _registerOnReceivedString() {
    onReceivedString(function (receivedString) {
        let serialNumber = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        // Did we just receive a packet from ourselves?
        if (serialNumber == SERIAL_NUMBER) {
            // Ignore it!
            return
        }
        // Initialize or append to receive buffer
        rxBuffer[serialNumber] = (rxBuffer[serialNumber] || "") + receivedString
        // Does the buffer start with an STX control character?
        if (rxBuffer[serialNumber].charCodeAt(0) == 2) {
            // Does the buffer end with an ETX control character?
            if (rxBuffer[serialNumber].charCodeAt(rxBuffer[serialNumber].length - 1) == 3) {
                // We're done; so we can strip the control characters off
                rxBuffer[serialNumber] = rxBuffer[serialNumber].slice(1, -1)
            }
            else {
                // We're NOT done; so don't parse and callback yet
                return;
            }
        }
        let receivedObject = JSON.parse(rxBuffer[serialNumber])
        // reset receive buffer
        rxBuffer[serialNumber] = ''
        _onReceivedObject(receivedObject, { 'serial number': serialNumber })
    })
}

} // namespace radio