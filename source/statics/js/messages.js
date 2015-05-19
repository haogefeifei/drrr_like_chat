/**
 * The messages exchanged with the server
 * @author: Lucy Linder
 * @date: 04.07.2014
 */

var MessageTypes = {

    // events from the socket
    WS_OPEN: 'open',
    WS_CLOSE: 'close',
    // incoming messages
    IN_HELLO_WOLRD: "hello_world",
    IN_GDC: "gdc",
    // outgoing messages
    OUT_GDC: "compute_gdc",
    OUT_HELLO_WOLRD: "hello"

};