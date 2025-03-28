namespace radio {

/**
 * Maximum string length by radio.sendString()
 */
export const MAX_PACKET_LENGTH: number = 19

/**
 * Serial number of this device
 */
const SERIAL_NUMBER: number = control.deviceSerialNumber()

/**
 * Receive Buffer handles single streams from multiple devices
 * indexed by serial number
 */
let rxBuffer: { [key: string]: string } = {}

/**
 * Initialize variable with well-defined no-op
 * @var {(receivedObject: any, props: number[]) => {} : void}
 */
let _onReceivedObject = (receivedObject: any, props: number[]) => {}

/**
 * Registers code to run when the radio receives an object.
 * Notice this will override any onReceivedString() callback
 */
export function onReceivedObject(cb: (receivedObject: any, props: number[]) => void)
{
    _onReceivedObject = cb
    _registerOnReceivedString()
}

/**
 * Send object serialized in JSON format over radio.
 * Chunks message into parts if over MAX_PACKET_LENGTH.
 * @param {any} value Object to be sent over radio
 */
export function sendObject(value: any)
{
    // Transmit Buffer
    let txBuffer = JSON.stringify(value);
    if(txBuffer.length > MAX_PACKET_LENGTH)
    {
        // If data is too long
        // Wrap it in control characters
        txBuffer = `\x02${txBuffer}\x03`
    }
    // Then chunk the string up and send it
    for(let p = 0; p < txBuffer.length; p += MAX_PACKET_LENGTH)
    {
        sendString(txBuffer.substr(p, MAX_PACKET_LENGTH))
    }
}

/**
 * Register onReceivedString() callback
 * that supports onReceivedObject()
 */
function _registerOnReceivedString() {
    onReceivedString(function (receivedString) {
        let serialNumber = receivedPacket(RadioPacketProperty.SerialNumber)
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

        // Parse complete encoding
        let receivedObject = JSON.parse(rxBuffer[serialNumber])

        // Reset receive buffer
        rxBuffer[serialNumber] = ''

        // Trigger callback
        _onReceivedObject(receivedObject, [
            receivedPacket(RadioPacketProperty.SignalStrength),
            serialNumber,
            // Notice: SignalStrength and Time are for last packet sent
            receivedPacket(RadioPacketProperty.Time)
        ])
    })
}

} // namespace radio