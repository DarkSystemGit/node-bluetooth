//bluetoothctl devices; bluetoothctl connect ${device.mac}
const child_process = require('child_process')
async function runComm(comm) {
    return new Promise((resolve, reject) => {
        child_process.exec(comm, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                resolve(`${stderr}`);
                return;
            }
            resolve(stdout)
        });
    })
}
/** 
 * Get all devices that can be paired with.
 * @function
 *  @async
 */
async function getDevices() {
    try {
        var devices = []
        var cmd = await runComm('bluetoothctl devices')
        cmd.split('\n').forEach(line => {
            var sections = line.split(' ')
            devices.push({ 'mac': sections[1], 'name': sections.slice(2).join(' ') })
        });
        return devices
    } catch (e) {
        throw new Error('Error while getting devices, ' + e);
    }
}
/** 
 * Connect to a bluetooth enabled device.
 * @async
 * @function
 * @param {string} name - The name of the device to disconnect from
*/
async function connect(name) {

    try {
        var devices = await getDevices();
        devices.forEach(async (dev) => {
            if (dev.name == name) {
                await runComm(`bluetoothctl connect ${dev.mac}`)
                return;
            }
        })
        throw new Error('no device found');
    } catch (e) {
        throw new Error('Error while connecting, ' + e);
    }

}
/** 
 * Disconnect from a bluetooth device.
 * @async
 * @function
 * @param {string} name - The name of the device to disconnect from
 */
async function disconnect(name) {
    try {
        var devices = await getDevices();
        devices.forEach(async (dev) => {
            if (dev.name == name) {
                await runComm(`bluetoothctl disconnect ${dev.mac}`)
                return;
            }
        })
        throw new Error('no device found');
    } catch (e) {
        throw new Error('Error while disconnecting, ' + e);
    }

}
/** 
 * Turn on bluetooth.
 * @async
 * @function
 */
async function on() {
    try {
        await runComm('rfkill unblock bluetooth')
    } catch (e) {
        throw new Error(e);
    }
}
/** 
 * Turn off bluetooth.
 * @async
 * @function
 */
async function off() {
    try {
        await runComm('rfkill block bluetooth')
    } catch (e) {
        throw new Error(e);
    }
}
/**
 * @author Dark System <pdarksystem@gmail.com>
 * @version 1.0.0
 */
var nodeBluez = { on, off, disconnect, connect, getDevices }
module.exports = nodeBluez