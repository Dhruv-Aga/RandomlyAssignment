//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
    window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
var msg = "";
var nodeData = []
var db;
var my_node_id = "";
var request = window.indexedDB.open("node_dht", 1);

request.onerror = function(event) {
    console.log("error: ");
};

request.onsuccess = function(event) {
    db = request.result;
    console.log("success: " + db);
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("nodes", { keyPath: "id" });
    
    $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
        msg = data.geobytesipaddress;
        my_node_id = SHA1(msg);
        nodeData = [
            { id: my_node_id, data: "Gopal Das", next: "00-02", previous: null }
        ];
        for (var i in nodeData) {
            objectStore.add(nodeData[i]);
        }
    });
    
}

function openWebsocket(){
    var url = document.URL;
    url = url.substring(url.indexOf(':'));
    url = 'ws'+url;
    var connection = new WebSocket("wss://javascript.info/article/websocket/demo/hello", ['newbound']);
    connection.onopen = function(){
        console.log("On open : ", connection);
        connection.send('chat');
    }

    connection.error = function(error){
        console.log("Network error : " + error);
    }

    connection.onmessage = function(e){
        console.log("On Message : ", e);
        var o = JSON.parse(e.data);
        var peer  = o.peer;
        var text = o.data;
        var connection  = new WebSocket("wss://javascript.info/article/websocket/demo/hello", ['newbound'])
        
    }
    console.log(connection);
    document.getElementById('storeConnection').connection = connection;
}   

openWebsocket();

// Need to work on it
function add(ext_node) {
    var request = db.transaction(["nodes"], "readwrite")
        .objectStore("nodes")
        .add(ext_node);

    request.onsuccess = function(event) {
        alert("Node has been added to your database.");
    };

    request.onerror = function(event) {
        alert("Unable to add data\r\Node is already exist in your database! ");
    }
}

function readAll() {
    var objectStore = db.transaction("nodes").objectStore("nodes");

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            alert("Node Id " + cursor.key + " has Data : " + cursor.value.data + ", with next Node: " + cursor.value.next + ", previous Node: " + cursor.value.previous);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };
}

function exit() {
    var request = db.transaction(["nodes"], "readwrite")
        .objectStore("nodes")
        .delete(my_node_id);

    request.onsuccess = function(event) {
        alert("You have been exited from Network");
    };
}