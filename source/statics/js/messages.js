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
    OUT_HELLO_WOLRD: "hello",

    OPEN_ROOM: "open_room",
    OPEN_ROOM_OK: "open_room_ok",

    SEND_MESSAGE: "send_message",
    SEND_MESSAGE_SUCCESS: "send_message_success"

};