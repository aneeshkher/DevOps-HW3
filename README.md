# DevOps CSC 591 007 - Homework 3  
#### Name: Aneesh Kher
#### Unity ID: aakher  

---

## Setup
For this asignment, I used the [express.js](http://expressjs.com/) framework to start two instances of a web server listening on ports `3000` and `3001` respectively. Since the goal of this assignment was to learn about caching and queues, I used [Redis](http://redis.io/) as an in memory data structure storage, to simulate the cache. A redis server was started which acted as the cache. For performing the functionality of a proxy server, I used the [http-proxy](https://github.com/nodejitsu/node-http-proxy) nodejs module to redirect all requests to one of the express.js servers.  


### Express
Once the web server was started, any request to an URL, for example, `/get` or `/set` etc, is captured by the express program using the `.get` method. The express framework contains methods for the major HTTP actions. Once captured, the programmer can write his implementation of what the server should do when that specific URL is visited. The `.get` corresponds to an HTTP `GET` and `.post` corresponds to HTTP `POST`.  

### Redis nodejs module
In order to communicate with redis, a redis server was installed and started before the express servers. The redis server allows a client program to import the [node redis module](https://github.com/NodeRedis/node_redis) and instantiate an object for communicating with the in memory database.

---

## Files  
1. `main3000.js` - The first express server. Listens for requests on port 3000 and accepts URLs like `/set`, `/get`, `/upload`, `/meow` etc.


2. `main3001.js` - The second express server. Identical to the first one, the only difference being that this server runs on port 3001 instead of port 3000.  


3. `proxy-server.js` - The proxy server. Accepts requests on `localhost` and redirects them to one of two expressjs servers.

Run each of the files individually using `node`. For example, `node main3000.js`.  

---

## Objectives

### Get and Set
To simulate the functionality of a timed cache, the expire feature of redis was used. Redis has a feature wherein a key value can be set for a specific amount of time (in this example, 10 seconds). Using the redis node module, all the redis methods can be called on the object instantiated inside the express program.

### Recently visited URLs
When a URL is visited, it is added into a redis list using the `lpush` function. When the user enters `localhost:3000/recent`, the first 5 entries of the list are retrieved. For achieving this, the `lrange` function is used to fetch the entries.  

### Image upload
Redis has the capability of storing any sort of text data. For uploading an image, it is first converted into `base64` text and added into a redis list. The image is uploaded using `curl` by setting the `-F` flag, which simulates a form fill action. In essence, this is a `POST` request to the server, which takes the POST data and adds it to a redis queue. On visiting `localhost:3000/meow`, the first image is fetched from the queue and displayed on the screen, while being removed fromt the queue.

### Additional server
In order to run an additional express server, a file identical to the `main3000.js` file was run. This will create another server which listens on port `3001`. All the operations and URLs are identical to the first server listening on port `3000`.

### Proxy
A third server was run, which acted as a proxy server and load balancer for the two running servers. This server was run on port 80, and redirected all requests to either of the first two servers. Whenever this server received a request, by typing `localhost` in the browser, it would choose one out of the two other servers, and send this request to it.  
Each server was chosen alternately. This was achieved by using the `rpoplpush` command in redis. This command would pop one element from list 1, and push it into list two. When a request would come to the proxy server, it would call `rpoplpush`, and redis would hand it one value, either 3000 or 3001. Based on this, it would forward the request to the server listening on 3000, and 3001 respectively. After sending the request, express would call `rpoplpush` again, and put the just used value at the back of the list. In this way, each server was chosen alternately.  

---


## Screencast link  
Please [click here](https://youtu.be/uxE1HdNwbpY) to view the YouTube link. You will be redirected to YouTube.  

---

