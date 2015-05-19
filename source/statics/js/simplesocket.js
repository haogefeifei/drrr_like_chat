/**
 * @author Lucy Linder
 * @date 04/07/14
 */

/**
 * Create a websocket.
 * To keep track of the state of the connection, you can register a callback
 * function for the open and close events like this:
 * \code{.js}
 * // explicit
 *  socket.bind( 'open', function );
 *  socket.bind( 'close', function );
 *  // using enum:
 *  socket.bind( 'open', ConnectionEvent.CLOSE );
 *  socket.bind( 'close', ConnectionEvent.CLOSE );
 * \endcode
 * @param url the url of the server socket (ex: http://localhost:42000/ws)
 * @constructor
 */
var SimpleSocketHandler = function( url ){
    var conn = new WebSocket( url );
    console.log( conn );
    var callbacks = {};

    /**
     * register a callback for the specified message_type.
     *
     * @param message_type a unique identifier of this kind of message
     * @param callback  the js function to call upon reception
     * @return {*} this socket object
     */
    this.bind = function( message_type, callback ){
        callbacks[ message_type ] = callbacks[ message_type ] || [];
        callbacks[ message_type ].push( callback );
        return this;
    };

    /**
     * send a message to the server
     * @param message_type  the message type
     * @param event_data  the data, most of the time a json object
     * @return {*} this socket object
     */
    this.send = function( message_type, event_data ){
        var payload = JSON.stringify( { type: message_type, data: event_data } );
        conn.send( payload ); // <= send JSON data to socket server
        return this;
    };

    // receive handler: use the message type to call the right handler
    conn.onmessage = function( evt ){
        console.log("received message "); console.log(evt);
        var json = JSON.parse( evt.data );
        dispatch( json.type, json.data );
    };

    // close handler: send a message of type "close"
    conn.onclose = function(){
        console.log("connection closed");
        dispatch( 'close', null );
    };

    // open handler: send a message of type "open"
    conn.onopen = function(){
        console.log("connection opened");
        dispatch( 'open', null );
    };

    // call the proper callback depending on the message type
    var dispatch = function( message_type, message ){
        console.log( "!event " );
        console.log( message_type );
        var chain = callbacks[ message_type ];

        if( typeof chain == 'undefined' ) return; // no callbacks for this event
        for( var i = 0; i < chain.length; i++ ){
            chain[i]( message )
        }
    }
};